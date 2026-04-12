/**
 * DetailScreen – full transaction details with the native Share API.
 *
 * As required by the assessment, displays:
 * - Reference ID (refId)
 * - Date of transfer (transferDate)
 * - Recipient name (recipientName)
 * - Transfer amount (amount)
 *
 * Users can share the transfer detail page externally via the system share sheet.
 */

import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTransactionStore } from '../store/useTransactionStore';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export default function DetailScreen() {
  const { refId } = useLocalSearchParams<{ refId: string }>();
  const router = useRouter();
  const transaction = useTransactionStore((s) =>
    s.transactions.find((t) => t.refId === refId),
  );

  // ── Not found state ────────────────────────────────────────────────
  if (!transaction) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>🔍</Text>
        <Text style={styles.errorTitle}>Transaction Not Found</Text>
        <Text style={styles.errorSubtitle}>
          This transaction may have been removed from the cache.
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isIncoming = transaction.amount >= 0;
  const amountColor = isIncoming ? '#16a34a' : '#dc2626';
  const amountPrefix = isIncoming ? '+' : '-';
  const displayAmount = formatCurrency(Math.abs(transaction.amount));

  /** Share a human-readable summary of the transaction. */
  const handleShare = async () => {
    try {
      await Share.share({
        message: [
          `Transfer Details`,
          `────────────────`,
          `Reference ID: ${transaction.refId}`,
          `Transfer: ${transaction.transferName}`,
          `Recipient: ${transaction.recipientName}`,
          `Date: ${formatDateTime(transaction.transferDate)}`,
          `Amount: ${amountPrefix}${displayAmount}`,
        ].join('\n'),
      });
    } catch (err) {
      Alert.alert('Error', 'Unable to share this transaction.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── Header: Amount + Transfer Name ─────────────────────────── */}
      <View style={styles.header}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}{displayAmount}
        </Text>
        <Text style={styles.transferName}>{transaction.transferName}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: isIncoming ? '#dcfce7' : '#fee2e2' },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isIncoming ? '#16a34a' : '#dc2626' },
            ]}
          >
            {isIncoming ? 'Incoming' : 'Outgoing'}
          </Text>
        </View>
      </View>

      {/* ── Transaction Details ────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transfer Details</Text>

        <MetadataRow label="Reference ID" value={transaction.refId} />
        <MetadataRow
          label="Date"
          value={formatDateTime(transaction.transferDate)}
        />
        <MetadataRow label="Recipient" value={transaction.recipientName} />
        <MetadataRow
          label="Amount"
          value={`${amountPrefix}${displayAmount}`}
        />
      </View>

      {/* ── Share Button ───────────────────────────────────────────── */}
      <Pressable
        style={({ pressed }) => [
          styles.shareButton,
          pressed && styles.sharePressed,
        ]}
        onPress={handleShare}
        accessibilityRole="button"
        accessibilityLabel="Share transaction details"
      >
        <Text style={styles.shareText}>Share Transaction</Text>
      </Pressable>
    </ScrollView>
  );
}

/** A single key-value row in the metadata section. */
function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} selectable>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingBottom: 40,
  },
  // ── Header ──
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
  },
  transferName: {
    fontSize: 16,
    color: '#374151',
    marginTop: 8,
  },
  badge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  // ── Section ──
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 16,
  },
  // ── Share ──
  shareButton: {
    marginHorizontal: 16,
    marginTop: 32,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sharePressed: {
    opacity: 0.8,
  },
  shareText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  // ── Error ──
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#ffffff',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
