from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from flask import Flask, jsonify, request


def create_app() -> Flask:
    app = Flask(__name__)

    leads: list[dict[str, Any]] = [
        {"id": 1, "name": "Acme Corp", "risk_score": 0.82, "status": "new"},
        {"id": 2, "name": "Globex", "risk_score": 0.41, "status": "contacted"},
    ]

    @app.post("/predict")
    def predict() -> Any:
        payload = request.get_json(silent=True) or {}
        features = payload.get("features", {})

        score = float(features.get("score", 0.5))
        risk_level = "high" if score >= 0.7 else "low"

        return jsonify({"risk_score": score, "risk_level": risk_level})

    @app.get("/dashboard")
    def dashboard() -> Any:
        total = len(leads)
        high_risk = len([lead for lead in leads if lead["risk_score"] >= 0.7])

        return jsonify(
            {
                "total_leads": total,
                "high_risk_leads": high_risk,
                "generated_at": datetime.now(tz=timezone.utc).isoformat(),
            }
        )

    @app.get("/leads")
    def list_leads() -> Any:
        return jsonify({"leads": leads})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
