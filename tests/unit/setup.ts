import '@testing-library/jest-dom';
import { beforeAll, afterAll } from 'vitest';

process.env.APP_ENV = 'development';
process.env.MONGODB_URI = 'mongodb://localhost:27017/talentra_test';
process.env.JWT_ACCESS_SECRET = 'test_jwt_access_secret_32_chars_long_spec!';
process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret_32_chars_long_spec!';

// Global mock for IntersectionObserver (needed for Framer Motion viewport / whileInView in jsdom)
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(private callback: IntersectionObserverCallback) {}

  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Silence console.error for expected test warnings
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});
