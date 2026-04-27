from __future__ import annotations

from datetime import datetime
from typing import Dict, List

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PROFILE_ACTIONS: Dict[str, str] = {
    "Fiel": "Programa de relacionamento e oferta de serviços premium.",
    "Abandono": "Oferta de pacote de revisões com contato ativo.",
    "Esquecido": "Lembrete com link de agendamento em 1 clique.",
    "Economico": "Cupom de desconto com validade curta.",
}

LEADS: List[Dict[str, object]] = [
    {
        "cliente_id": "C1021",
        "perfil_predito": "Economico",
        "risco_evasao": "alto",
        "probabilidade_evasao": 0.84,
        "prioridade": 1,
        "acao_recomendada": PROFILE_ACTIONS["Economico"],
    },
    {
        "cliente_id": "C0844",
        "perfil_predito": "Esquecido",
        "risco_evasao": "medio",
        "probabilidade_evasao": 0.61,
        "prioridade": 2,
        "acao_recomendada": PROFILE_ACTIONS["Esquecido"],
    },
]

REQUIRED_FIELDS = {
    "cliente_id",
    "idade",
    "regiao",
    "forma_pagamento",
    "modelo_carro",
    "historico_marca",
    "canal_compra",
}


def _error_response(
    error: str, invalid_fields: List[str], hint: str
) -> tuple[object, int]:
    return (
        jsonify(
            {
                "error": error,
                "invalid_fields": sorted(invalid_fields),
                "hint": hint,
            }
        ),
        400,
    )


def _validate_predict_payload(payload: Dict[str, object]) -> tuple[bool, object]:
    invalid_fields: List[str] = []

    for field in sorted(REQUIRED_FIELDS):
        value = payload.get(field)
        if value is None or (isinstance(value, str) and not value.strip()):
            invalid_fields.append(field)

    if invalid_fields:
        return False, _error_response(
            "payload invalido: campos obrigatorios ausentes ou vazios",
            invalid_fields,
            "Preencha todos os campos obrigatorios e envie valores nao vazios.",
        )

    try:
        idade = int(payload.get("idade"))
    except (TypeError, ValueError):
        return False, _error_response(
            "payload invalido: idade deve ser um inteiro",
            ["idade"],
            "Use um numero inteiro para idade, por exemplo: 35.",
        )

    if idade < 18 or idade > 100:
        return False, _error_response(
            "payload invalido: idade fora da faixa plausivel",
            ["idade"],
            "A idade deve estar entre 18 e 100 anos.",
        )

    payload["idade"] = idade
    return True, None


def _dummy_profile_probabilities(payload: Dict[str, object]) -> Dict[str, float]:
    base = {"Fiel": 0.25, "Abandono": 0.25, "Esquecido": 0.25, "Economico": 0.25}

    idade = int(payload.get("idade", 35))
    forma_pagamento = str(payload.get("forma_pagamento", "")).lower()
    historico_marca = str(payload.get("historico_marca", "")).lower()
    canal_compra = str(payload.get("canal_compra", "")).lower()

    if "avista" in forma_pagamento or "à vista" in forma_pagamento:
        base["Fiel"] += 0.10
    else:
        base["Economico"] += 0.10

    if "ja" in historico_marca or "já" in historico_marca:
        base["Fiel"] += 0.10
    else:
        base["Abandono"] += 0.10

    if "online" in canal_compra:
        base["Esquecido"] += 0.05

    if idade < 30:
        base["Economico"] += 0.05
    elif idade > 55:
        base["Esquecido"] += 0.05

    total = sum(base.values())
    return {k: round(v / total, 4) for k, v in base.items()}


def _risk_from_profile(profile: str, prob: float) -> str:
    if profile == "Fiel" and prob >= 0.5:
        return "baixo"
    if prob >= 0.7:
        return "alto"
    if prob >= 0.45:
        return "medio"
    return "baixo"


def _priority_from_risk(risk: str) -> int:
    return {"alto": 1, "medio": 2, "baixo": 3}[risk]


@app.get("/health")
def health() -> object:
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat() + "Z"})


@app.post("/predict")
def predict() -> object:
    payload = request.get_json(silent=True) or {}

    is_valid, error_response = _validate_predict_payload(payload)
    if not is_valid:
        return error_response

    probs = _dummy_profile_probabilities(payload)
    profile = max(probs, key=probs.get)
    confidence = probs[profile]
    risk = _risk_from_profile(profile, confidence)

    prediction = {
        "cliente_id": payload["cliente_id"],
        "perfil_predito": profile,
        "probabilidades": probs,
        "risco_evasao": risk,
        "acao_recomendada": PROFILE_ACTIONS[profile],
        "model_version": "baseline-heuristico-v1",
        "observacao": "placeholder sem ML real (para integração inicial)",
    }

    LEADS.append(
        {
            "cliente_id": prediction["cliente_id"],
            "perfil_predito": profile,
            "risco_evasao": risk,
            "probabilidade_evasao": confidence,
            "prioridade": _priority_from_risk(risk),
            "acao_recomendada": PROFILE_ACTIONS[profile],
        }
    )

    return jsonify(prediction)


@app.get("/dashboard")
def dashboard() -> object:
    total = len(LEADS)
    high_risk = len([lead for lead in LEADS if lead["risco_evasao"] == "alto"])

    return jsonify(
        {
            "vin_share": {
                "geral": 0.63,
                "por_regiao": {
                    "Sudeste": 0.67,
                    "Sul": 0.64,
                    "Nordeste": 0.58,
                    "Centro-Oeste": 0.61,
                    "Norte": 0.55,
                },
                "por_modelo": {"Ranger": 0.70, "Territory": 0.60, "Transit": 0.57},
            },
            "pipeline": {
                "total_leads": total,
                "alto_risco": high_risk,
                "percentual_alto_risco": round((high_risk / total) * 100, 2) if total else 0,
            },
            "clientes_por_perfil": {
                "Fiel": 320,
                "Abandono": 180,
                "Esquecido": 210,
                "Economico": 290,
            },
        }
    )


@app.get("/leads")
def leads() -> object:
    sorted_leads = sorted(
        LEADS,
        key=lambda item: (item["prioridade"], -float(item["probabilidade_evasao"])),
    )
    return jsonify({"total": len(sorted_leads), "data": sorted_leads})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
