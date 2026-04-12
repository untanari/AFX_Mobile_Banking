import { formatCurrency, formatDate, formatDateTime, capitalize } from '../src/utils/formatters';

describe('formatCurrency', () => {
  it('formats a whole number with two decimal places', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('formats a number with cents', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats a small amount', () => {
    expect(formatCurrency(0.99)).toBe('$0.99');
  });

  it('rounds to two decimal places', () => {
    expect(formatCurrency(10.999)).toBe('$11.00');
  });

  it('formats negative amounts correctly', () => {
    expect(formatCurrency(500)).toBe('$500.00');
  });
});

describe('formatDate', () => {
  it('formats an ISO string into a short date', () => {
    const result = formatDate('2025-06-15T10:30:00Z');
    expect(result).toMatch(/Jun\s+15,?\s+2025/);
  });

  it('handles different months', () => {
    const result = formatDate('2025-01-01T00:00:00Z');
    expect(result).toMatch(/Jan/);
  });

  it('formats the assessment sample date correctly', () => {
    const result = formatDate('2024-10-15T12:34:56Z');
    expect(result).toMatch(/Oct\s+15,?\s+2024/);
  });
});

describe('formatDateTime', () => {
  it('includes both date and time parts', () => {
    const result = formatDateTime('2025-06-15T10:30:00Z');
    expect(result).toContain('at');
    expect(result).toMatch(/Jun/);
  });
});

describe('capitalize', () => {
  it('capitalises the first letter of a lowercase string', () => {
    expect(capitalize('pending')).toBe('Pending');
  });

  it('leaves an already capitalised string unchanged', () => {
    expect(capitalize('Completed')).toBe('Completed');
  });

  it('handles a single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('returns an empty string unchanged', () => {
    expect(capitalize('')).toBe('');
  });
});
