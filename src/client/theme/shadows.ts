/**
 * Shadow system — xs through 2xl, dark and light variants.
 * Used in MUI theme overrides and CSS custom properties.
 */

export const lightShadows = {
  xs:  '0 1px 2px rgba(0,0,0,0.05)',
  sm:  '0 2px 8px rgba(0,0,0,0.07)',
  md:  '0 4px 16px rgba(0,0,0,0.08)',
  lg:  '0 8px 32px rgba(0,0,0,0.10)',
  xl:  '0 16px 48px rgba(0,0,0,0.12)',
  '2xl':'0 24px 64px rgba(0,0,0,0.15)',
  brand: '0 8px 32px rgba(37,99,235,0.25)',
  accent:'0 8px 32px rgba(192,38,211,0.20)',
} as const;

export const darkShadows = {
  xs:  '0 1px 2px rgba(0,0,0,0.30)',
  sm:  '0 2px 8px rgba(0,0,0,0.40)',
  md:  '0 4px 16px rgba(0,0,0,0.45)',
  lg:  '0 8px 32px rgba(0,0,0,0.50)',
  xl:  '0 16px 48px rgba(0,0,0,0.55)',
  '2xl':'0 24px 64px rgba(0,0,0,0.60)',
  brand: '0 8px 32px rgba(59,130,246,0.30)',
  accent:'0 8px 32px rgba(217,70,239,0.25)',
} as const;

export type ShadowKey = keyof typeof lightShadows;
