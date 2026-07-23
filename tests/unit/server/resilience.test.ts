import { describe, it, expect, vi } from 'vitest';
import {
  calculateBackoffDelay,
  retryWithBackoff,
  withTimeout,
  TimeoutError,
  CircuitBreaker,
  CircuitBreakerOpenError,
} from '../../../src/server/utils/resilience.js';

describe('Enterprise Resilience Suite', () => {
  describe('calculateBackoffDelay', () => {
    it('calculates exponential delays correctly without jitter', () => {
      expect(calculateBackoffDelay(1, 100, 5000, 2, false)).toBe(100);
      expect(calculateBackoffDelay(2, 100, 5000, 2, false)).toBe(200);
      expect(calculateBackoffDelay(3, 100, 5000, 2, false)).toBe(400);
      expect(calculateBackoffDelay(4, 100, 5000, 2, false)).toBe(800);
    });

    it('respects maximum delay cap', () => {
      expect(calculateBackoffDelay(10, 100, 1000, 2, false)).toBe(1000);
    });

    it('applies full jitter within [0, calculatedDelay]', () => {
      for (let i = 0; i < 50; i++) {
        const delay = calculateBackoffDelay(3, 100, 5000, 2, true);
        expect(delay).toBeGreaterThanOrEqual(0);
        expect(delay).toBeLessThanOrEqual(400);
      }
    });
  });

  describe('withTimeout', () => {
    it('resolves fast operations normally', async () => {
      const result = await withTimeout(async () => 'fast', 500);
      expect(result).toBe('fast');
    });

    it('throws TimeoutError when operation exceeds deadline', async () => {
      const slowFn = () => new Promise((resolve) => setTimeout(resolve, 200));
      await expect(withTimeout(slowFn, 50)).rejects.toThrow(TimeoutError);
    });
  });

  describe('retryWithBackoff', () => {
    it('returns result on first success attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(fn, { maxRetries: 3, initialDelayMs: 10, jitter: false });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('retries until success within attempt limit', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 3) throw new Error('Transient error');
        return 'eventual success';
      };

      const result = await retryWithBackoff(fn, { maxRetries: 3, initialDelayMs: 5, jitter: false });
      expect(result).toBe('eventual success');
      expect(attempts).toBe(3);
    });

    it('throws when maxRetries limit is exhausted', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Persistent failure'));
      await expect(
        retryWithBackoff(fn, { maxRetries: 2, initialDelayMs: 5, jitter: false })
      ).rejects.toThrow('Persistent failure');
      expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });
  });

  describe('CircuitBreaker', () => {
    it('starts in CLOSED state and allows successful executions', async () => {
      const cb = new CircuitBreaker('TestService', { failureThreshold: 3 });
      expect(cb.getState()).toBe('CLOSED');

      const result = await cb.execute(async () => 'ok');
      expect(result).toBe('ok');
      expect(cb.getState()).toBe('CLOSED');
    });

    it('trips to OPEN state when failure threshold is reached', async () => {
      const cb = new CircuitBreaker('TestService', { failureThreshold: 2, resetTimeoutMs: 1000 });
      const failFn = async () => {
        throw new Error('Service outage');
      };

      await expect(cb.execute(failFn)).rejects.toThrow('Service outage');
      expect(cb.getState()).toBe('CLOSED');

      await expect(cb.execute(failFn)).rejects.toThrow('Service outage');
      expect(cb.getState()).toBe('OPEN');

      // Subsequent calls fail fast without executing failFn
      await expect(cb.execute(async () => 'ok')).rejects.toThrow(CircuitBreakerOpenError);
    });

    it('transitions to HALF_OPEN after resetTimeout and resets on success', async () => {
      const cb = new CircuitBreaker('TestService', { failureThreshold: 1, resetTimeoutMs: 50, halfOpenSuccessThreshold: 1 });
      
      // Trip to OPEN
      await expect(cb.execute(async () => { throw new Error('fail'); })).rejects.toThrow();
      expect(cb.getState()).toBe('OPEN');

      // Wait for reset timeout
      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(cb.getState()).toBe('HALF_OPEN');

      // Successful probe request resets breaker to CLOSED
      const probeResult = await cb.execute(async () => 'recovered');
      expect(probeResult).toBe('recovered');
      expect(cb.getState()).toBe('CLOSED');
    });
  });
});
