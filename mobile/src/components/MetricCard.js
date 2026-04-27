import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MetricCard({ title, value, subtitle }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  title: { fontSize: 12, color: '#6B7280' },
  value: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginTop: 2 },
  subtitle: { fontSize: 12, color: '#334155', marginTop: 4 },
});
