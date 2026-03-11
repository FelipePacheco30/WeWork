#!/usr/bin/env sh
set -eu

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

docker compose -f docker-compose.dev.yml up --build
