# Challengee

Implementação com `api/` (Flask) e `mobile/` (React Native/Expo) cobrindo:

- Push notifications com `expo-notifications` para leads de alto risco.
- Fallback offline no mobile via `AsyncStorage` para dashboard e leads.
- Suíte de testes API com `pytest` + Flask test client (`/predict`, `/dashboard`, `/leads`).
- Smoke tests mobile para renderização e fluxo principal de predição.

## Estrutura

- `api/app.py`: endpoints `/predict`, `/dashboard` e `/leads`.
- `api/tests/test_api.py`: testes da API.
- `mobile/App.js`: app mobile com push + cache offline.
- `mobile/__tests__/App.test.js`: testes smoke do app.

## Como rodar testes

### API

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r api/requirements.txt
pytest api/tests -q
```

### Mobile

```bash
cd mobile
npm install
npm test
```
