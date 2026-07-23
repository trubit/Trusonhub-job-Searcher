import { describe, it, expect } from 'vitest';
import { escapeRegExp } from '../../../src/server/utils/escapeRegExp.js';

describe('escapeRegExp Utility', () => {
  it('escapes special regular expression characters safely', () => {
    expect(escapeRegExp('C++ Developer')).toBe('C\\+\\+ Developer');
    expect(escapeRegExp('React (Hooks)')).toBe('React \\(Hooks\\)');
    expect(escapeRegExp('[Senior] Lead')).toBe('\\[Senior\\] Lead');
    expect(escapeRegExp('Price: $100*')).toBe('Price: \\$100\\*');
    expect(escapeRegExp('Node.js | Python')).toBe('Node\\.js \\| Python');
  });

  it('returns empty string for falsy input', () => {
    expect(escapeRegExp('')).toBe('');
    expect(escapeRegExp(null as never)).toBe('');
  });

  it('preserves normal alphanumeric characters', () => {
    expect(escapeRegExp('Frontend Engineer 123')).toBe('Frontend Engineer 123');
  });
});
