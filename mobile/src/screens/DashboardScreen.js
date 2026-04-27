import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import MetricCard from '../components/MetricCard';
import { fetchDashboard } from '../services/api';

export default function DashboardScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const response = await fetchDashboard();
      setData(response);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ActivityIndicator color="#fff" size="large" />;
  }

  if (error) {
    return <Text style={styles.error}>Erro: {error}</Text>;
  }

  return (
    <ScrollView>
      <MetricCard title="VIN Share Geral" value={`${(data.vin_share.geral * 100).toFixed(1)}%`} />
      <MetricCard
        title="Leads em Alto Risco"
        value={String(data.pipeline.alto_risco)}
        subtitle={`${data.pipeline.percentual_alto_risco}% do total`}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VIN Share por Região</Text>
        {Object.entries(data.vin_share.por_regiao).map(([region, value]) => (
          <Text key={region} style={styles.item}>{`• ${region}: ${(value * 100).toFixed(1)}%`}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8, color: '#0F172A' },
  item: { color: '#334155', marginBottom: 4 },
  error: { color: '#FCA5A5' },
});
