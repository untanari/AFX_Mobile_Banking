import { fetchTransactionsFromApi } from '../src/services/api';
import { Transaction, TransactionResponse } from '../src/types';

// Prevent the simulated 10% failure rate from causing flaky tests
beforeEach(() => {
  jest.spyOn(Math, 'random').mockReturnValue(0.5);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('fetchTransactionsFromApi', () => {
  it('returns a TransactionResponse with a data array', async () => {
    const response: TransactionResponse = await fetchTransactionsFromApi();
    expect(response).toHaveProperty('data');
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('returns transactions with the correct shape', async () => {
    const response = await fetchTransactionsFromApi();
    const txn: Transaction = response.data[0];

    expect(txn).toHaveProperty('refId');
    expect(txn).toHaveProperty('transferDate');
    expect(txn).toHaveProperty('recipientName');
    expect(txn).toHaveProperty('transferName');
    expect(txn).toHaveProperty('amount');
    expect(typeof txn.refId).toBe('string');
    expect(typeof txn.transferDate).toBe('string');
    expect(typeof txn.recipientName).toBe('string');
    expect(typeof txn.transferName).toBe('string');
    expect(typeof txn.amount).toBe('number');
  });

  it('includes the assessment sample transactions', async () => {
    const response = await fetchTransactionsFromApi();
    const refIds = response.data.map((t) => t.refId);

    // The four sample transactions from the assessment spec
    expect(refIds).toContain('123ABC');
    expect(refIds).toContain('456DEF');
    expect(refIds).toContain('789GHI');
    expect(refIds).toContain('101JKL');
  });

  it('returns transactions sorted by date descending (newest first)', async () => {
    const response = await fetchTransactionsFromApi();
    const dates = response.data.map((t) => new Date(t.transferDate).getTime());

    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });

  it('contains both positive and negative amounts', async () => {
    const response = await fetchTransactionsFromApi();
    const hasPositive = response.data.some((t) => t.amount > 0);
    const hasNegative = response.data.some((t) => t.amount < 0);

    expect(hasPositive).toBe(true);
    expect(hasNegative).toBe(true);
  });

  it('returns at least 4 transactions', async () => {
    const response = await fetchTransactionsFromApi();
    expect(response.data.length).toBeGreaterThanOrEqual(4);
  });
});
