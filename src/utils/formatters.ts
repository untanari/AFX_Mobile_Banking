/**
 * Utility functions for formatting dates and currency values.
 */

/**
 * Format a number as USD currency.
 *
 * @example formatCurrency(1234.5) => "$1,234.50"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format an ISO date string into a human-readable short form.
 *
 * @example formatDate("2025-06-15T10:30:00Z") => "Jun 15, 2025"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format an ISO date string into a full date-time representation.
 *
 * @example formatDateTime("2025-06-15T10:30:00Z") => "Jun 15, 2025 at 10:30 AM"
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart} at ${timePart}`;
}

/**
 * Capitalise the first letter of a string.
 *
 * @example capitalize("pending") => "Pending"
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
