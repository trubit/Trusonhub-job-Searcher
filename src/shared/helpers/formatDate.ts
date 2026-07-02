import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export type DateInput = string | Date | number | null | undefined;

/**
 * Format: "Jan 15, 2025"
 */
export function formatDate(date: DateInput): string {
  if (!date) return '';
  return dayjs(date).format('MMM D, YYYY');
}

/**
 * Format: "Jan 15, 2025 at 3:45 PM"
 */
export function formatDateTime(date: DateInput): string {
  if (!date) return '';
  return dayjs(date).format('MMM D, YYYY [at] h:mm A');
}

/**
 * Relative time: "2 hours ago", "in 3 days"
 */
export function fromNow(date: DateInput): string {
  if (!date) return '';
  return dayjs(date).fromNow();
}

/**
 * ISO 8601 format for API requests.
 */
export function toISOString(date: DateInput): string {
  if (!date) return '';
  return dayjs(date).toISOString();
}

/**
 * Check if a date is in the past.
 */
export function isPast(date: DateInput): boolean {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs());
}

/**
 * Check if a date is in the future.
 */
export function isFuture(date: DateInput): boolean {
  if (!date) return false;
  return dayjs(date).isAfter(dayjs());
}

/**
 * Format job posting age (e.g., "Posted 3 days ago").
 */
export function formatPostedDate(date: DateInput): string {
  if (!date) return '';
  const d = dayjs(date);
  const diffDays = dayjs().diff(d, 'day');

  if (diffDays === 0) return 'Posted today';
  if (diffDays === 1) return 'Posted yesterday';
  if (diffDays < 30) return `Posted ${diffDays} days ago`;
  return `Posted ${d.format('MMM D, YYYY')}`;
}
