#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"

$composeFile = "docker_compose_sghospitalizacion02.yml"
$networkName = "sghospitalizacion_net"

Write-Host "[1/3] Verificando herramientas y entorno..."
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { throw "Docker no está instalado o no está en PATH." }
try { docker compose version | Out-Null } catch { throw "Docker Compose (v2) no disponible." }

# Asegurar que la red compartida exista
$netExists = docker network ls --filter "name=$networkName" -q
if (-not $netExists) {
    Write-Host "Creando red compartida $networkName..."
    docker network create $networkName | Out-Null
}

Write-Host "[2/3] Construyendo imagen(es)..."
docker compose -f $composeFile build

Write-Host "[3/3] Levantando stack..."
docker compose -f $composeFile up -d --remove-orphans

docker compose -f $composeFile ps
Write-Host "Logs (Ctrl+C para salir)..."
docker compose -f $composeFile logs -f app
