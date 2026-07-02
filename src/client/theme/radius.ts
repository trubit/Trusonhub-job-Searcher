/**
 * Border radius design tokens.
 */
export const radius = {
  xs:   '4px',
  sm:   '6px',
  md:   '10px',
  lg:   '16px',
  xl:   '24px',
  '2xl':'32px',
  pill: '9999px',
} as const;

export type RadiusKey = keyof typeof radius;
