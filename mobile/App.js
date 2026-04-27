import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const DASHBOARD_KEY = 'dashboard_cache';
const LEADS_KEY = 'leads_cache';
const API_BASE_URL = 'http://localhost:5000';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [leads, setLeads] = useState([]);
  const [scoreInput, setScoreInput] = useState('0.9');
  const [prediction, setPrediction] = useState(null);
  const [source, setSource] = useState('network');

  useEffect(() => {
    registerPush();
    loadInitialData();
  }, []);

  const registerPush = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      await Notifications.getExpoPushTokenAsync();
    }
  };

  const loadInitialData = async () => {
    try {
      const [dashboardResponse, leadsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard`),
        fetch(`${API_BASE_URL}/leads`),
      ]);
      const dashboardData = await dashboardResponse.json();
      const leadsData = await leadsResponse.json();

      setDashboard(dashboardData);
      setLeads(leadsData.leads ?? []);
      setSource('network');

      await AsyncStorage.setItem(DASHBOARD_KEY, JSON.stringify(dashboardData));
      await AsyncStorage.setItem(LEADS_KEY, JSON.stringify(leadsData.leads ?? []));

      notifyHighRisk(leadsData.leads ?? []);
    } catch (error) {
      const cachedDashboard = await AsyncStorage.getItem(DASHBOARD_KEY);
      const cachedLeads = await AsyncStorage.getItem(LEADS_KEY);

      if (cachedDashboard) {
        setDashboard(JSON.parse(cachedDashboard));
      }
      if (cachedLeads) {
        setLeads(JSON.parse(cachedLeads));
      }
      setSource('cache');
    }
  };

  const notifyHighRisk = async (leadList) => {
    const highRiskLeads = leadList.filter((lead) => lead.risk_score >= 0.7);
    if (highRiskLeads.length === 0) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Novos leads de alto risco',
        body: `${highRiskLeads.length} lead(s) requerem atenção imediata.`,
      },
      trigger: null,
    });
  };

  const runPrediction = async () => {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features: { score: Number(scoreInput) } }),
    });
    const data = await response.json();
    setPrediction(data);
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text testID="source-indicator">Fonte: {source}</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Dashboard</Text>
        <Text testID="total-leads">Total de leads: {dashboard?.total_leads ?? '-'}</Text>
        <Text testID="high-risk-leads">Alto risco: {dashboard?.high_risk_leads ?? '-'}</Text>

        <Text style={{ marginTop: 16, fontSize: 20, fontWeight: 'bold' }}>Predição</Text>
        <TextInput
          testID="score-input"
          value={scoreInput}
          onChangeText={setScoreInput}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, marginVertical: 8 }}
        />
        <Button title="Executar predição" onPress={runPrediction} />
        {prediction && (
          <View testID="prediction-result" style={{ marginTop: 8 }}>
            <Text>Score: {prediction.risk_score}</Text>
            <Text>Nível: {prediction.risk_level}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
