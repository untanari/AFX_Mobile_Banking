/**
 * ErrorBanner – a dismissible banner shown at the top of the list when the
 * simulated API returns a failure.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  message: string;
  onDismiss: () => void;
  onRetry: () => void;
}

export function ErrorBanner({ message, onDismiss, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
        <Pressable onPress={onDismiss} style={styles.button}>
          <Text style={styles.dismissText}>Dismiss</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fef2f2',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#fca5a5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: '#991b1b',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 16,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
  },
  dismissText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
});
