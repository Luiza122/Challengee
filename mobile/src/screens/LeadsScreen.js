import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchLeads } from '../services/api';

const riskColor = {
  alto: '#DC2626',
  medio: '#D97706',
  baixo: '#16A34A',
};

export default function LeadsScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      const response = await fetchLeads();
      setData(response.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <ActivityIndicator color="#fff" size="large" />;
  if (error) return <Text style={styles.error}>Erro: {error}</Text>;

  return (
    <ScrollView>
      {data.map((lead) => (
        <View key={`${lead.cliente_id}-${lead.prioridade}`} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.client}>{lead.cliente_id}</Text>
            <Text style={[styles.badge, { backgroundColor: riskColor[lead.risco_evasao] || '#64748B' }]}>
              {lead.risco_evasao.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.text}>Perfil: {lead.perfil_predito}</Text>
          <Text style={styles.text}>Prob.: {(lead.probabilidade_evasao * 100).toFixed(1)}%</Text>
          <Text style={styles.action}>Ação: {lead.acao_recomendada}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  client: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  badge: { color: '#fff', fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  text: { color: '#334155', marginTop: 4 },
  action: { color: '#0F172A', marginTop: 6, fontWeight: '600' },
  error: { color: '#FCA5A5' },
});
