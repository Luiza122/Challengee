import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import DashboardScreen from './src/screens/DashboardScreen';
import LeadsScreen from './src/screens/LeadsScreen';
import PredictScreen from './src/screens/PredictScreen';

const TABS = {
  DASHBOARD: 'dashboard',
  LEADS: 'leads',
  PREDICT: 'predict',
};

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>FORDRETAIN</Text>
        <Text style={styles.subtitle}>Retenção preditiva no pós-venda</Text>
      </View>

      <View style={styles.tabs}>
        <TabButton label="Dashboard" active={activeTab === TABS.DASHBOARD} onPress={() => setActiveTab(TABS.DASHBOARD)} />
        <TabButton label="Leads" active={activeTab === TABS.LEADS} onPress={() => setActiveTab(TABS.LEADS)} />
        <TabButton label="Predição" active={activeTab === TABS.PREDICT} onPress={() => setActiveTab(TABS.PREDICT)} />
      </View>

      <View style={styles.content}>
        {activeTab === TABS.DASHBOARD && <DashboardScreen />}
        {activeTab === TABS.LEADS && <LeadsScreen />}
        {activeTab === TABS.PREDICT && <PredictScreen />}
      </View>
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#081F67' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E3A8A' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: '#C7D2FE', marginTop: 4 },
  tabs: { flexDirection: 'row', padding: 8, gap: 8 },
  tabButton: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: { backgroundColor: '#F59E0B' },
  tabLabel: { color: '#DBEAFE', fontWeight: '600' },
  tabLabelActive: { color: '#111827' },
  content: { flex: 1, padding: 12 },
});
