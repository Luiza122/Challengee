# API FORDRETAIN (MVP)

## Rodar local
```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Endpoints
- `GET /health`
- `POST /predict`
- `GET /dashboard`
- `GET /leads`

> Observação: `POST /predict` usa heurística placeholder para facilitar integração inicial. Trocar por modelo de ML treinado no próximo passo.
