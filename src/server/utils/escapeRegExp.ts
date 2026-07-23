/**
 * Safely escapes special regex characters in user input strings
 * to prevent Regular Expression Denial of Service (ReDoS) vulnerabilities.
 */
export function escapeRegExp(input: string): string {
  if (!input) return '';
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
