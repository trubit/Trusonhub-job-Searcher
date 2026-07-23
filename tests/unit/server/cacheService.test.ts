import { describe, it, expect, beforeEach } from 'vitest';
import { cacheService } from '../../../src/server/services/cacheService.js';

describe('CacheService Unit Tests', () => {
  beforeEach(async () => {
    await cacheService.del('test_key');
    await cacheService.delPattern('test_*');
  });

  it('stores and retrieves cached items correctly', async () => {
    const data = { id: 1, title: 'Senior Software Engineer' };
    await cacheService.set('test_key', data, 60);

    const retrieved = await cacheService.get<typeof data>('test_key');
    expect(retrieved).toEqual(data);
  });

  it('deletes individual cached keys', async () => {
    await cacheService.set('test_key', 'value', 60);
    await cacheService.del('test_key');

    const retrieved = await cacheService.get('test_key');
    expect(retrieved).toBeNull();
  });

  it('deletes keys matching a pattern', async () => {
    await cacheService.set('test_1', 'val1', 60);
    await cacheService.set('test_2', 'val2', 60);
    await cacheService.delPattern('test_*');

    expect(await cacheService.get('test_1')).toBeNull();
    expect(await cacheService.get('test_2')).toBeNull();
  });

  it('remembers and caches factory results', async () => {
    let fetchCount = 0;
    const fetcher = async () => {
      fetchCount++;
      return { total: 42 };
    };

    const first = await cacheService.remember('test_remember', 60, fetcher);
    const second = await cacheService.remember('test_remember', 60, fetcher);

    expect(first).toEqual({ total: 42 });
    expect(second).toEqual({ total: 42 });
    expect(fetchCount).toBe(1);
  });
});
