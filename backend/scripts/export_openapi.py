from pathlib import Path

import yaml

from app.main import app


def main() -> None:
    spec = app.openapi()
    target = Path(__file__).resolve().parents[2] / "api_spec.yaml"
    with open(target, "w", encoding="utf-8") as f:
        yaml.safe_dump(spec, f, sort_keys=False, allow_unicode=False)


if __name__ == "__main__":
    main()
