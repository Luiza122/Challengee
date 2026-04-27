import { API_BASE_URL } from '../constants/config';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Erro na API');
  }

  return data;
}

export function fetchDashboard() {
  return request('/dashboard');
}

export function fetchLeads() {
  return request('/leads');
}

export function predictClient(payload) {
  return request('/predict', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
