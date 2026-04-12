/**
 * SkeletonLoader – placeholder UI shown while the initial fetch is in progress.
 *
 * Renders a configurable number of "shimmer" rows that match the layout
 * of TransactionItem so the transition feels seamless.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface Props {
  rows?: number;
}

function SkeletonRow() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.row, { opacity }]}>
      <View style={styles.circle} />
      <View style={styles.lines}>
        <View style={styles.lineShort} />
        <View style={styles.lineLong} />
      </View>
      <View style={styles.amountBlock} />
    </Animated.View>
  );
}

export function SkeletonLoader({ rows = 8 }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonRow key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 12,
  },
  lines: {
    flex: 1,
    marginRight: 12,
  },
  lineShort: {
    width: '60%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginBottom: 6,
  },
  lineLong: {
    width: '40%',
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  amountBlock: {
    width: 64,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
});
