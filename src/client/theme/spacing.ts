/**
 * 8px base spacing scale aligned with MUI defaults and Bootstrap spacing.
 * Values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
 */
export const spacingConfig = 8;

export const spacing = {
  0: '0px',
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  64: '64px',
  80: '80px',
  96: '96px',
} as const;

export type SpacingKey = keyof typeof spacing;
