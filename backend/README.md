# Backend WeWork

API FastAPI com arquitetura em camadas para cadastro de profissionais.

## Rodar local

```bash
pip install .[dev]
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

## Endpoints principais

- `GET /health`
- `POST /professionals`
- `GET /professionals`
- `GET /professionals/{id}`
- `PUT /professionals/{id}`
- `DELETE /professionals/{id}`
- `GET /professionals/export/csv`

## Testes

```bash
pytest -q
```
