# FORDRETAIN — App + API integrados (MVP funcional)

Este repositório entrega uma versão integrada do desafio:
- **API Flask** para predição, dashboard e leads.
- **App mobile React Native (Expo)** consumindo a API.

## Estrutura
- `api/` backend Flask
- `mobile/` app Expo

## 1) Subir a API
```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
API rodando em `http://localhost:5000`.

## 2) Subir o app mobile
Em outro terminal:
```bash
cd mobile
npm install
npm run start
```

## Endpoints disponíveis
- `GET /health`
- `POST /predict`
- `GET /dashboard`
- `GET /leads`

## Observação importante
A predição atual usa **heurística placeholder** (sem modelo treinado real), para permitir integração ponta a ponta agora.
Próximo passo: substituir a heurística por inferência do modelo de ML treinado (Base 1 + Base 2).
