/**
 * Core domain types for the BankApp transaction system.
 *
 * The Transaction interface mirrors the backend response contract:
 *   { refId, transferDate, recipientName, transferName, amount }
 */

export interface Transaction {
  refId: string;
  transferDate: string; // ISO 8601 UTC string
  recipientName: string;
  transferName: string;
  amount: number; // positive = incoming, negative = outgoing / refund
}

/** Shape returned by the simulated backend. */
export interface TransactionResponse {
  data: Transaction[];
}

/** Shape of the store state (data only, no actions). */
export interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

/** Actions exposed by the store (Zustand Action Pattern). */
export interface TransactionActions {
  fetchTransactions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  getTransactionByRefId: (refId: string) => Transaction | undefined;
  clearError: () => void;
}

/** Combined store type. */
export type TransactionStore = TransactionState & TransactionActions;

/** Navigation param list for the stack navigator. */
export type RootStackParamList = {
  List: undefined;
  Detail: { refId: string };
};
