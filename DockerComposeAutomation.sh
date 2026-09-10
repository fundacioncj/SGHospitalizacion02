#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="docker_compose_sghospitalizacion02.yml"
NETWORK_NAME="sghospitalizacion_net"

echo "[1/3] Verificando herramientas y entorno..."
command -v docker >/dev/null 2>&1 || { echo "Docker no está instalado."; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "Docker Compose (v2) no disponible."; exit 1; }

# Asegurar que la red compartida exista
docker network inspect "${NETWORK_NAME}" >/dev/null 2>&1 || {
  echo "Creando red compartida ${NETWORK_NAME}..."
  docker network create "${NETWORK_NAME}"
}

echo "[2/3] Construyendo imagen(es)..."
docker compose -f "${COMPOSE_FILE}" build

echo "[3/3] Levantando stack..."
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans

docker compose -f "${COMPOSE_FILE}" ps
echo "Logs (Ctrl+C para salir)..."
docker compose -f "${COMPOSE_FILE}" logs -f app
