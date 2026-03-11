import pytest


@pytest.mark.asyncio
async def test_crud_professional(client, sample_payload):
    create_response = await client.post("/api/v1/professionals", json=sample_payload)
    assert create_response.status_code == 201
    created = create_response.json()
    professional_id = created["id"]
    assert created["nome"] == sample_payload["nome"]

    get_response = await client.get(f"/api/v1/professionals/{professional_id}")
    assert get_response.status_code == 200
    assert get_response.json()["email"] == sample_payload["email"]

    update_payload = {**sample_payload, "cargo": "Senior QA"}
    update_response = await client.put(f"/api/v1/professionals/{professional_id}", json=update_payload)
    assert update_response.status_code == 200
    assert update_response.json()["cargo"] == "Senior QA"

    patch_response = await client.patch(
        f"/api/v1/professionals/{professional_id}",
        json={"departamento": "Qualidade"},
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["departamento"] == "Qualidade"

    delete_response = await client.delete(f"/api/v1/professionals/{professional_id}")
    assert delete_response.status_code == 204

    inactive_response = await client.get(f"/api/v1/professionals/{professional_id}")
    assert inactive_response.status_code == 200
    assert inactive_response.json()["status"] == "inativo"


@pytest.mark.asyncio
async def test_filters_and_csv_export(client, sample_payload):
    await client.post("/api/v1/professionals", json=sample_payload)
    await client.post(
        "/api/v1/professionals",
        json={**sample_payload, "email": "outro@empresa.com", "nome": "Outro Nome", "cargo": "Dev"},
    )

    response = await client.get(
        "/api/v1/professionals",
        params={"q": "Maria", "cargo": "QA", "page": 1, "page_size": 10},
    )
    assert response.status_code == 200
    payload = response.json()
    items = payload["items"]
    assert len(items) == 1
    assert items[0]["nome"] == "Maria Teste"
    assert payload["total"] >= 1

    csv_response = await client.get("/api/v1/professionals/export/csv", params={"q": "Maria"})
    assert csv_response.status_code == 200
    assert "text/csv" in csv_response.headers["content-type"]
    assert "Maria Teste" in csv_response.text


@pytest.mark.asyncio
async def test_healthcheck(client):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
