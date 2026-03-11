import pytest


@pytest.mark.asyncio
async def test_crud_professional(client, sample_payload):
    create_response = await client.post("/professionals", json=sample_payload)
    assert create_response.status_code == 201
    created = create_response.json()
    professional_id = created["id"]
    assert created["nome"] == sample_payload["nome"]

    get_response = await client.get(f"/professionals/{professional_id}")
    assert get_response.status_code == 200
    assert get_response.json()["email"] == sample_payload["email"]

    update_payload = {**sample_payload, "cargo": "Senior QA"}
    update_response = await client.put(f"/professionals/{professional_id}", json=update_payload)
    assert update_response.status_code == 200
    assert update_response.json()["cargo"] == "Senior QA"

    delete_response = await client.delete(f"/professionals/{professional_id}")
    assert delete_response.status_code == 204

    missing_response = await client.get(f"/professionals/{professional_id}")
    assert missing_response.status_code == 404


@pytest.mark.asyncio
async def test_filters_and_csv_export(client, sample_payload):
    await client.post("/professionals", json=sample_payload)
    await client.post(
        "/professionals",
        json={**sample_payload, "email": "outro@empresa.com", "nome": "Outro Nome", "cargo": "Dev"},
    )

    response = await client.get("/professionals", params={"nome": "Maria", "cargo": "QA"})
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 1
    assert items[0]["nome"] == "Maria Teste"

    csv_response = await client.get("/professionals/export/csv", params={"nome": "Maria"})
    assert csv_response.status_code == 200
    assert "text/csv" in csv_response.headers["content-type"]
    assert "Maria Teste" in csv_response.text
