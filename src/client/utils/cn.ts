/**
 * Lightweight utility for combining CSS class names conditionally.
 * Avoids pulling in an external dep for a trivial use case.
 *
 * @example
 * cn('base', isActive && 'active', variant === 'large' && 'large')
 * // => 'base active'
 */
export function cn(...classes: (string | boolean | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
