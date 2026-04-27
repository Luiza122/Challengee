from pathlib import Path
import sys

import pytest

sys.path.append(str(Path(__file__).resolve().parents[2]))

from api.app import create_app


@pytest.fixture()
def client():
    app = create_app()
    app.config.update({"TESTING": True})

    with app.test_client() as test_client:
        yield test_client


def test_predict_returns_high_risk(client):
    response = client.post("/predict", json={"features": {"score": 0.9}})

    assert response.status_code == 200
    data = response.get_json()
    assert data["risk_score"] == 0.9
    assert data["risk_level"] == "high"


def test_dashboard_returns_metrics(client):
    response = client.get("/dashboard")

    assert response.status_code == 200
    data = response.get_json()
    assert data["total_leads"] == 2
    assert data["high_risk_leads"] == 1
    assert "generated_at" in data


def test_leads_returns_list(client):
    response = client.get("/leads")

    assert response.status_code == 200
    data = response.get_json()
    assert "leads" in data
    assert len(data["leads"]) == 2
