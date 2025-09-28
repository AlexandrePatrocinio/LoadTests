#!/bin/bash
set -e

echo "🔄 Limpando banco k6 no InfluxDB..."

docker-compose exec influxdb influx -execute "DROP DATABASE k6" || true
docker-compose exec influxdb influx -execute "CREATE DATABASE k6"

echo "✅ Banco k6 recriado com sucesso!"