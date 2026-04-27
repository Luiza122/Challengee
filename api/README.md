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

## `POST /predict` - exemplos de payload

### Payload válido
```json
{
  "cliente_id": "C2001",
  "idade": 34,
  "regiao": "Sudeste",
  "forma_pagamento": "À vista",
  "modelo_carro": "Ranger",
  "historico_marca": "Já teve Ford",
  "canal_compra": "Online"
}
```

### Payload inválido (campos vazios + idade inválida)
```json
{
  "cliente_id": "",
  "idade": "dezesseis",
  "regiao": "Sul",
  "forma_pagamento": "",
  "modelo_carro": "Territory",
  "historico_marca": "Primeira compra",
  "canal_compra": "Loja física"
}
```

### Exemplo de erro padronizado (HTTP 400)
```json
{
  "error": "payload invalido: campos obrigatorios ausentes ou vazios",
  "invalid_fields": ["cliente_id", "forma_pagamento"],
  "hint": "Preencha todos os campos obrigatorios e envie valores nao vazios."
}
```
