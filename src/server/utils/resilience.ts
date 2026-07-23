import { logger } from './logger.js';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  factor?: number;
  jitter?: boolean;
  timeoutMs?: number;
  onRetry?: (error: Error, attempt: number, delayMs: number) => void;
}

export class TimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Operation timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
  }
}

export class CircuitBreakerOpenError extends Error {
  constructor(serviceName: string) {
    super(`Circuit breaker is OPEN for service: ${serviceName}. Request rejected immediately.`);
    this.name = 'CircuitBreakerOpenError';
  }
}

/**
 * Executes a function with timeout protection.
 */
export async function withTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(timeoutMs));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([fn(), timeoutPromise]);
    return result;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Calculates exponential backoff delay with full jitter.
 */
export function calculateBackoffDelay(
  attempt: number,
  initialDelayMs = 200,
  maxDelayMs = 5000,
  factor = 2,
  jitter = true
): number {
  const calculatedDelay = Math.min(maxDelayMs, initialDelayMs * Math.pow(factor, attempt - 1));
  if (jitter) {
    // Full Jitter algorithm: random between 0 and calculated delay
    return Math.floor(Math.random() * calculatedDelay);
  }
  return calculatedDelay;
}

/**
 * Retries an async operation using exponential backoff with full jitter and optional timeout.
 */
export async function retryWithBackoff<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 200,
    maxDelayMs = 5000,
    factor = 2,
    jitter = true,
    timeoutMs,
    onRetry,
  } = options;

  let lastError: Error = new Error('Operation failed without explicit exception');

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      if (timeoutMs && timeoutMs > 0) {
        return await withTimeout(() => fn(attempt), timeoutMs);
      }
      return await fn(attempt);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt > maxRetries) {
        break;
      }

      const delayMs = calculateBackoffDelay(attempt, initialDelayMs, maxDelayMs, factor, jitter);

      if (onRetry) {
        onRetry(lastError, attempt, delayMs);
      } else {
        logger.warn(`Retry attempt ${attempt}/${maxRetries} failed: ${lastError.message}. Waiting ${delayMs}ms...`);
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeoutMs?: number;
  halfOpenSuccessThreshold?: number;
}

/**
 * Enterprise Circuit Breaker implementation.
 * States: CLOSED (normal) -> OPEN (fail fast) -> HALF_OPEN (probe state).
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private nextAttemptAt = 0;

  constructor(
    public readonly name: string,
    private readonly options: CircuitBreakerOptions = {}
  ) {}

  public getState(): CircuitBreakerState {
    if (this.state === 'OPEN' && Date.now() >= this.nextAttemptAt) {
      this.state = 'HALF_OPEN';
      this.successCount = 0;
      logger.info(`⚡ Circuit Breaker [${this.name}] transitioned from OPEN to HALF_OPEN (probing...)`);
    }
    return this.state;
  }

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      throw new CircuitBreakerOpenError(this.name);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  private onSuccess(): void {
    const halfOpenSuccessThreshold = this.options.halfOpenSuccessThreshold ?? 2;

    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= halfOpenSuccessThreshold) {
        this.reset();
        logger.info(`✅ Circuit Breaker [${this.name}] reset to CLOSED after successful probe(s)`);
      }
    } else if (this.state === 'CLOSED') {
      this.failureCount = 0;
    }
  }

  private onFailure(error: unknown): void {
    const failureThreshold = this.options.failureThreshold ?? 5;
    const resetTimeoutMs = this.options.resetTimeoutMs ?? 10000;

    this.failureCount++;

    if (this.state === 'HALF_OPEN' || this.failureCount >= failureThreshold) {
      this.state = 'OPEN';
      this.nextAttemptAt = Date.now() + resetTimeoutMs;
      logger.error(
        `🚨 Circuit Breaker [${this.name}] TRIPPED to OPEN! Failures: ${this.failureCount}. Resetting in ${resetTimeoutMs}ms.`,
        { error }
      );
    }
  }

  public reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttemptAt = 0;
  }
}
