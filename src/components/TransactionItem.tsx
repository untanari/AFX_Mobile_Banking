/**
 * TransactionItem – a single row in the transaction list.
 *
 * Shows the transfer name, date, recipient, and amount.
 * Amount is colour-coded: green for incoming (positive), red for outgoing (negative).
 */

import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface Props {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

function TransactionItemBase({ transaction, onPress }: Props) {
  const isIncoming = transaction.amount >= 0;
  const amountColor = isIncoming ? '#16a34a' : '#dc2626';
  const displayAmount = formatCurrency(Math.abs(transaction.amount));
  const amountPrefix = isIncoming ? '+' : '-';

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(transaction)}
      accessibilityRole="button"
      accessibilityLabel={`${transaction.transferName} to ${transaction.recipientName}, ${amountPrefix}${displayAmount}`}
    >
      {/* Left: Transfer icon indicator */}
      <View
        style={[
          styles.indicator,
          { backgroundColor: isIncoming ? '#dcfce7' : '#fee2e2' },
        ]}
      >
        <Text style={styles.indicatorText}>{isIncoming ? '↓' : '↑'}</Text>
      </View>

      {/* Middle: Transfer name + date */}
      <View style={styles.details}>
        <Text style={styles.transferName} numberOfLines={1}>
          {transaction.transferName}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatDate(transaction.transferDate)} · {transaction.recipientName}
        </Text>
      </View>

      {/* Right: Amount */}
      <Text style={[styles.amount, { color: amountColor }]}>
        {amountPrefix}{displayAmount}
      </Text>
    </Pressable>
  );
}

export const TransactionItem = memo(TransactionItemBase);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  pressed: {
    backgroundColor: '#f3f4f6',
  },
  indicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  indicatorText: {
    fontSize: 18,
    fontWeight: '700',
  },
  details: {
    flex: 1,
    marginRight: 12,
  },
  transferName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
});
