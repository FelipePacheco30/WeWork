if (-Not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}

docker compose -f docker-compose.dev.yml up --build
