import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import App from '../App';

const dashboardResponse = {
  total_leads: 2,
  high_risk_leads: 1,
};

const leadsResponse = {
  leads: [
    { id: 1, name: 'Acme', risk_score: 0.8 },
    { id: 2, name: 'Globex', risk_score: 0.3 },
  ],
};

describe('App smoke tests', () => {
  beforeEach(() => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ json: async () => dashboardResponse })
      .mockResolvedValueOnce({ json: async () => leadsResponse })
      .mockResolvedValueOnce({
        json: async () => ({ risk_score: 0.9, risk_level: 'high' }),
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza dashboard inicial', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Total de leads: 2')).toBeTruthy();
      expect(screen.getByText('Alto risco: 1')).toBeTruthy();
    });
  });

  it('executa fluxo principal de predição', async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByTestId('score-input')).toBeTruthy());

    fireEvent.changeText(screen.getByTestId('score-input'), '0.9');
    fireEvent.press(screen.getByText('Executar predição'));

    await waitFor(() => {
      expect(screen.getByTestId('prediction-result')).toBeTruthy();
      expect(screen.getByText('Nível: high')).toBeTruthy();
    });
  });
});
