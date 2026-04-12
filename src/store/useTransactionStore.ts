/**
 * Zustand store for transaction state management.
 *
 * Uses the **Action Pattern**: state shape and action creators are cleanly
 * separated in the type layer (`TransactionState` vs `TransactionActions`),
 * but combined in a single store for ergonomic usage.
 *
 * Persistence is handled via `zustand/middleware` + AsyncStorage so the last
 * successfully fetched data is available offline / on next cold start.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionStore } from '../types';
import { fetchTransactionsFromApi } from '../services/api';

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────
      transactions: [],
      isLoading: false,
      isRefreshing: false,
      error: null,

      // ── Actions ────────────────────────────────────────────────────────

      /**
       * Initial fetch – shows the skeleton loader.
       * On failure the cached transactions (if any) remain visible.
       */
      fetchTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetchTransactionsFromApi();
          set({ transactions: response.data, isLoading: false });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'An unexpected error occurred.';
          set({ isLoading: false, error: message });
        }
      },

      /**
       * Pull-to-refresh – uses `isRefreshing` so the list stays visible
       * behind the refresh spinner.
       */
      refreshTransactions: async () => {
        set({ isRefreshing: true, error: null });
        try {
          const response = await fetchTransactionsFromApi();
          set({ transactions: response.data, isRefreshing: false });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'An unexpected error occurred.';
          set({ isRefreshing: false, error: message });
        }
      },

      /** Lookup a single transaction by refId from the in-memory list. */
      getTransactionByRefId: (refId: string) => {
        return get().transactions.find((t) => t.refId === refId);
      },

      /** Dismiss the error banner manually. */
      clearError: () => set({ error: null }),
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the transaction data – not transient UI flags.
      partialize: (state) => ({
        transactions: state.transactions,
      }),
    },
  ),
);
