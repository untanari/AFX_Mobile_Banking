/**
 * ListScreen – main transaction list.
 *
 * Features:
 * - FlatList with optimised rendering (keyExtractor, getItemLayout)
 * - Pull-to-refresh via RefreshControl
 * - Skeleton loader for initial load
 * - Error banner with retry / dismiss
 * - Empty state when no transactions exist
 */

import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTransactionStore } from '../store/useTransactionStore';
import { TransactionItem } from '../components/TransactionItem';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorBanner } from '../components/ErrorBanner';
import { Transaction } from '../types';

const ITEM_HEIGHT = 69; // paddingVertical 14*2 + ~41 content

export default function ListScreen() {
  const router = useRouter();
  const {
    transactions,
    isLoading,
    isRefreshing,
    error,
    fetchTransactions,
    refreshTransactions,
    clearError,
  } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePress = useCallback(
    (transaction: Transaction) => {
      router.push({
        pathname: '/detail',
        params: { refId: transaction.refId },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionItem transaction={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  const keyExtractor = useCallback((item: Transaction) => item.refId, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  // ── Initial loading state ──────────────────────────────────────────
  if (isLoading && transactions.length === 0) {
    return (
      <View style={styles.container}>
        <SkeletonLoader />
      </View>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────
  const ListEmptyComponent = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Transactions</Text>
      <Text style={styles.emptySubtitle}>
        Pull down to refresh or check back later.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {error && (
        <ErrorBanner
          message={error}
          onRetry={refreshTransactions}
          onDismiss={clearError}
        />
      )}

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshTransactions}
            tintColor="#6b7280"
          />
        }
        contentContainerStyle={
          transactions.length === 0 ? styles.emptyList : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
