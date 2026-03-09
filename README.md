# Shopflow Capstone Project

This is a full production pipeline capstone project that incorporates microservices, containerization, orchestration, infrastructure-as-code, CI/CD, and monitoring. For learning purposes, the project is designed to be runnable locally using `docker-compose`, while also providing the AWS and Terraform configurations needed to deploy to Swarm on EC2.

## Table of Contents
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Monitoring](#monitoring)

## Architecture
- **Frontend**: React + Vite + Tailwind
- **Auth Service**: Node.js + Express
- **Product Service**: Node.js + Express
- **Order Service**: Python + FastAPI
- **Proxy**: NGINX routing to all services
- **Monitoring**: Prometheus (Metrics), Loki (Logs), Grafana (Dashboards)

## Requirements
- Docker and Docker Compose
- Node.js (for local dev without Docker)
- Terraform (for infrastructure provisioning)

## Local Development

Run the entire stack locally using Docker Compose:

```bash
cd docker
docker-compose up --build
```

Access the Services:
- **Frontend App**: http://localhost:3000
- **Grafana Dashboards**: http://localhost:3001
- **Auth Service API**: http://localhost:4001
- **Product Service API**: http://localhost:4002
- **Order Service API**: http://localhost:4003
- **Nginx API Gateway**: http://localhost:8080

## Production Deployment

### 1. Terraform
Provision the infrastructure on AWS (Free Tier eligible):
```bash
cd infrastructure/terraform
terraform init
terraform apply
```

This sets up a VPC, Security Groups, and an EC2 instance pre-configured with Docker Swarm.

### 2. CI/CD pipeline
Set up your GitLab CI/CD variables:
- `AWS_EC2_MANAGER_IP`
- `AWS_EC2_SSH_KEY`
- `JWT_SECRET`
*(Note: GitLab automatically provides `$CI_REGISTRY_USER`, `$CI_REGISTRY_PASSWORD`, and `$CI_REGISTRY` variables for the built-in container registry).*

When you push code to `main`, the `.gitlab-ci.yml` pipeline will trigger, build Docker images for all services, and push them to the GitLab Container Registry.
When the build stage passes, the deploy stage uses SSH to connect to your EC2 Swarm manager instance and deploys the stack.

## Monitoring
The system includes Prometheus and Promtail/Loki configured through Grafana.
Metrics from the Node.js and Python services are actively scraped by Prometheus and shipped to Grafana.
