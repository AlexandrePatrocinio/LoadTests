# LoadTests

Este projeto realiza testes de carga automatizados na API REST de exemplo da biblioteca AutoCRUD (https://github.com/AlexandrePatrocinio/api) utilizando [k6](https://k6.io/). O objetivo é simular cenários reais de uso, avaliando o desempenho, escalabilidade e estabilidade da API sob diferentes níveis de concorrência.

## Objetivos

- Simular operações de leitura, criação, atualização e exclusão de pessoas.
- Gerar dados aleatórios e cenários variados para testar a robustez da API.
- Medir tempos de resposta e taxas de sucesso das requisições.
- Permitir análise de performance e identificação de gargalos.

## Como funciona

O script principal (`load-test.js`) executa diferentes tipos de operações na API `/persons`:

- **60%** operações de leitura (GET)
- **15%** criação única (POST)
- **5%** criação em lote (POST /batch)
- **15%** atualização (PUT)
- **5%** exclusão (DELETE)

Os dados das pessoas são gerados aleatoriamente, incluindo nome, alias, data de nascimento e stack tecnológica. O volume de usuários simulados aumenta gradualmente conforme definido nas etapas (`stages`) do teste.

## Principais arquivos

- `load-test.js`: Script de teste de carga para k6.
- `docker-compose.yml`: Orquestra serviços como InfluxDB e Grafana para monitoramento (se disponível).
- `reset-k6-db.sh`: Script para reinicializar o banco de dados de métricas.

## Como executar

1. Configure o endereço da API no script (`baseUrl`).
2. Utilize Docker Compose para subir serviços de monitoramento.
3. Execute o teste com k6:
   ```bash
   docker-compose run --rm k6 run --out influxdb=http://influxdb:8086/k6 /scripts/load-test.js
   ```
## Resumo

Este projeto facilita a análise de performance de uma API REST de pessoas, automatizando testes de carga e fornecendo métricas para tomada de decisão sobre escalabilidade e estabilidade.

## Français

Ce projet réalise des tests de charge automatisés dans l'API REST d'exemple de la bibliothèque AutoCRUD (https://github.com/AlexandrePatrocinio/api) en utilisant [k6](https://k6.io/). L'objectif est de simuler des scénarios d'utilisation réels, en évaluant les performances, la scalabilité et la stabilité de l'API sous différents niveaux de concurrence.

### Objectifs

- Simuler des opérations de lecture, création, mise à jour et suppression de personnes.
- Générer des données aléatoires et des scénarios variés pour tester la robustesse de l'API.
- Mesurer les temps de réponse et les taux de succès des requêtes.
- Permettre l'analyse des performances et l'identification des goulets d'étranglement.

### Fonctionnement

Le script principal (`load-test.js`) exécute différents types d'opérations sur l'API `/persons` :

- **60%** opérations de lecture (GET)
- **15%** création unique (POST)
- **5%** création en lot (POST /batch)
- **15%** mise à jour (PUT)
- **5%** suppression (DELETE)

Les données des personnes sont générées aléatoirement, incluant le nom, l'alias, la date de naissance et la stack technologique. Le volume d'utilisateurs simulés augmente progressivement selon les étapes (`stages`) du test.

### Fichiers principaux

- `load-test.js` : Script de test de charge pour k6.
- `docker-compose.yml` : Orchestre des services comme InfluxDB et Grafana pour la surveillance (si disponible).
- `reset-k6-db.sh` : Script pour réinitialiser la base de données des métriques.

### Comment exécuter

1. Configurez l'adresse de l'API dans le script (`baseUrl`).
2. Utilisez Docker Compose pour démarrer les services de surveillance.
3. Exécutez le test avec k6 :
   ```bash
   docker-compose run --rm k6 run --out influxdb=http://influxdb:8086/k6 /scripts/load-test.js
   ```

### Résumé

Ce projet facilite l'analyse des performances d'une API REST de personnes, automatisant les tests de charge et fournissant des métriques pour la prise de décision sur la scalabilité et la stabilité.

## English

This project performs automated load testing on a sample REST API from the AutoCRUD library using [k6](https://k6.io/). The goal is to simulate real-world usage scenarios, evaluating the API's performance, scalability, and stability under different levels of concurrency.

### Objectives

- Simulate read, create, update, and delete operations for people.
- Generate random data and varied scenarios to test API robustness.
- Measure response times and request success rates.
- Enable performance analysis and bottleneck identification.

### How it works

The main script (`load-test.js`) executes different types of operations on the `/persons` API:

- **60%** read operations (GET)
- **15%** single creation (POST)
- **5%** batch creation (POST /batch)
- **15%** update (PUT)
- **5%** deletion (DELETE)

Person data is generated randomly, including name, alias, birthdate, and technology stack. The number of simulated users increases gradually as defined in the test `stages`.

### Main files

- `load-test.js`: Load test script for k6.
- `docker-compose.yml`: Orchestrates services like InfluxDB and Grafana for monitoring (if available).
- `reset-k6-db.sh`: Script to reset the metrics database.

### How to run

1. Set the API address in the script (`baseUrl`).
2. Use Docker Compose to start monitoring services.
3. Run the test with k6:
   ```bash
   docker-compose run --rm k6 run --out influxdb=http://influxdb:8086/k6 /scripts/load-test.js
   ```

### Summary

This project facilitates performance analysis of a people REST API, automating load tests and providing metrics for decision-making on scalability and stability.
