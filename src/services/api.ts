/**
 * Simulated banking API.
 *
 * - Returns the assessment's sample transactions plus additional realistic
 *   entries to demonstrate scrolling and varied data.
 * - Introduces a realistic 800-1500 ms network delay.
 * - Fails ~10 % of the time to exercise error-handling paths.
 */

import { Transaction, TransactionResponse } from '../types';

/**
 * Static dataset.
 * The first four entries are the exact sample from the assessment brief.
 * Additional entries demonstrate variety (incoming / outgoing, different dates).
 */
const MOCK_TRANSACTIONS: Transaction[] = [
  // ── Assessment sample data ────────────────────────────────────────
  {
    refId: '123ABC',
    transferDate: '2024-10-15T12:34:56Z',
    recipientName: 'John Doe',
    transferName: 'Salary Payment',
    amount: 1500.0,
  },
  {
    refId: '456DEF',
    transferDate: '2024-09-21T09:12:45Z',
    recipientName: 'Jane Smith',
    transferName: 'Invoice Payment',
    amount: 2300.75,
  },
  {
    refId: '789GHI',
    transferDate: '2024-10-05T16:18:30Z',
    recipientName: 'Robert Brown',
    transferName: 'Refund',
    amount: -500.0,
  },
  {
    refId: '101JKL',
    transferDate: '2024-08-30T11:47:22Z',
    recipientName: 'Emily Davis',
    transferName: 'Bonus Payment',
    amount: 1200.0,
  },

  // ── Additional realistic entries (above & beyond) ─────────────────
  {
    refId: '202MNO',
    transferDate: '2024-10-12T08:15:00Z',
    recipientName: 'Netflix Inc.',
    transferName: 'Subscription',
    amount: -15.99,
  },
  {
    refId: '303PQR',
    transferDate: '2024-10-10T14:22:33Z',
    recipientName: 'Sarah Johnson',
    transferName: 'Rent Transfer',
    amount: -1800.0,
  },
  {
    refId: '404STU',
    transferDate: '2024-10-08T17:45:10Z',
    recipientName: 'Grab Malaysia',
    transferName: 'Ride Payment',
    amount: -23.5,
  },
  {
    refId: '505VWX',
    transferDate: '2024-10-01T09:00:00Z',
    recipientName: 'Employer Sdn Bhd',
    transferName: 'Monthly Salary',
    amount: 5200.0,
  },
  {
    refId: '606YZA',
    transferDate: '2024-09-28T11:30:00Z',
    recipientName: 'Tenaga Nasional',
    transferName: 'Electricity Bill',
    amount: -145.6,
  },
  {
    refId: '707BCD',
    transferDate: '2024-09-25T16:05:42Z',
    recipientName: 'Ahmad Razak',
    transferName: 'Peer Transfer',
    amount: -250.0,
  },
  {
    refId: '808EFG',
    transferDate: '2024-09-20T10:10:10Z',
    recipientName: 'Maybank Fixed Deposit',
    transferName: 'FD Maturity',
    amount: 10500.0,
  },
  {
    refId: '909HIJ',
    transferDate: '2024-09-15T13:25:55Z',
    recipientName: 'Shopee Malaysia',
    transferName: 'Online Purchase',
    amount: -89.9,
  },
];

/**
 * Fetch transactions from the simulated backend.
 *
 * @returns A promise that resolves to a `TransactionResponse` matching the
 *          backend contract: `{ data: Transaction[] }`.
 * @throws  Simulates a network failure ~10 % of the time.
 */
export async function fetchTransactionsFromApi(): Promise<TransactionResponse> {
  // Realistic network latency
  const delay = 800 + Math.random() * 700; // 800-1500 ms
  await new Promise((resolve) => setTimeout(resolve, delay));

  // 10 % failure rate
  if (Math.random() < 0.1) {
    throw new Error(
      'Network request failed. Please check your connection and try again.',
    );
  }

  // Return sorted newest-first, wrapped in the response envelope
  const sorted = [...MOCK_TRANSACTIONS].sort(
    (a, b) =>
      new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime(),
  );

  return { data: sorted };
}
