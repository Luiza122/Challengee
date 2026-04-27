import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { predictClient } from '../services/api';

const initialForm = {
  cliente_id: '',
  idade: '',
  regiao: '',
  forma_pagamento: '',
  modelo_carro: '',
  historico_marca: '',
  canal_compra: '',
};

export default function PredictScreen() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit() {
    try {
      setLoading(true);
      setError('');

      const payload = {
        ...form,
        idade: Number(form.idade),
      };

      const response = await predictClient(payload);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView>
      {Object.keys(initialForm).map((field) => (
        <View style={styles.field} key={field}>
          <Text style={styles.label}>{field}</Text>
          <TextInput
            style={styles.input}
            value={form[field]}
            onChangeText={(value) => setField(field, value)}
            keyboardType={field === 'idade' ? 'numeric' : 'default'}
            placeholder={`Digite ${field}`}
            placeholderTextColor="#94A3B8"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        <Text style={styles.buttonLabel}>{loading ? 'Processando...' : 'Prever perfil'}</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>Erro: {error}</Text> : null}

      {result ? (
        <View style={styles.result}>
          <Text style={styles.title}>Resultado</Text>
          <Text style={styles.text}>Perfil: {result.perfil_predito}</Text>
          <Text style={styles.text}>Risco: {result.risco_evasao}</Text>
          <Text style={styles.text}>Ação: {result.acao_recomendada}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 10 },
  label: { color: '#E2E8F0', marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#0F172A',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonLabel: { color: '#111827', fontWeight: '700' },
  error: { color: '#FCA5A5', marginTop: 10 },
  result: { marginTop: 12, backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  text: { color: '#334155', marginBottom: 4 },
});
