.PHONY: help build up down restart logs ps clean pull push backup restore health

# Default target
help:
	@echo "Sudoku Web - Docker Management Commands"
	@echo ""
	@echo "Build:"
	@echo "  make build           - Build all Docker images"
	@echo "  make build-no-cache  - Build without cache"
	@echo ""
	@echo "Run:"
	@echo "  make up              - Start all services"
	@echo "  make down            - Stop all services"
	@echo "  make restart         - Restart all services"
	@echo "  make ps              - Show running containers"
	@echo ""
	@echo "Logs & Debug:"
	@echo "  make logs            - View all logs"
	@echo "  make logs-backend    - View backend logs"
	@echo "  make logs-frontend   - View frontend logs"
	@echo "  make logs-db         - View database logs"
	@echo "  make health          - Check service health"
	@echo ""
	@echo "Registry:"
	@echo "  make push            - Push images to registry"
	@echo "  make pull            - Pull images from registry"
	@echo ""
	@echo "Database:"
	@echo "  make backup          - Backup database"
	@echo "  make restore         - Restore database"
	@echo "  make db-shell        - Open PostgreSQL shell"
	@echo "  make db-migrate      - Run database migrations"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean           - Remove stopped containers and dangling images"
	@echo "  make reset           - Remove all containers, volumes, and images (DESTRUCTIVE)"

# Build targets
build:
	docker compose build

build-no-cache:
	docker compose build --no-cache

# Run targets
up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

ps:
	docker compose ps

# Log targets
logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f db

# Health check
health:
	@echo "=== Service Status ==="
	docker compose ps
	@echo ""
	@echo "=== Backend Health ==="
	@curl -s http://localhost:3001/health || echo "Backend not responding"
	@echo ""
	@echo "=== Frontend Health ==="
	@curl -s http://localhost:8080/health || echo "Frontend not responding"

# Registry targets (requires REGISTRY_URL and IMAGE_TAG in .env)
push:
	@if [ -z "$$REGISTRY_URL" ]; then echo "Error: REGISTRY_URL not set in .env"; exit 1; fi
	docker compose build
	docker tag sudoku-backend $${REGISTRY_URL}sudoku-backend:$${IMAGE_TAG:-latest}
	docker tag sudoku-frontend $${REGISTRY_URL}sudoku-frontend:$${IMAGE_TAG:-latest}
	docker push $${REGISTRY_URL}sudoku-backend:$${IMAGE_TAG:-latest}
	docker push $${REGISTRY_URL}sudoku-frontend:$${IMAGE_TAG:-latest}

pull:
	@if [ -z "$$REGISTRY_URL" ]; then echo "Error: REGISTRY_URL not set in .env"; exit 1; fi
	docker pull $${REGISTRY_URL}sudoku-backend:$${IMAGE_TAG:-latest}
	docker pull $${REGISTRY_URL}sudoku-frontend:$${IMAGE_TAG:-latest}
	docker compose up -d

# Database targets
backup:
	@mkdir -p backups
	docker compose exec -T db pg_dump -U $${POSTGRES_USER:-sudoku} $${POSTGRES_DB:-sudoku} > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup completed in backups/"

restore:
	@echo "Usage: make restore FILE=backups/backup_xxx.sql"
	@if [ -z "$$FILE" ]; then echo "Error: FILE parameter required"; exit 1; fi
	docker compose exec -T db psql -U $${POSTGRES_USER:-sudoku} $${POSTGRES_DB:-sudoku} < $$FILE

db-shell:
	docker compose exec db psql -U $${POSTGRES_USER:-sudoku} $${POSTGRES_DB:-sudoku}

db-migrate:
	docker compose exec backend npx prisma migrate deploy

# Maintenance targets
clean:
	docker compose down
	docker container prune -f
	docker image prune -f

reset: clean
	docker volume rm sudoku-web_postgres_data 2>/dev/null || true
	docker system prune -af
	@echo "Complete reset done. Run 'make build && make up' to start fresh."

# Development targets
dev: up
	@echo "Waiting for services to start..."
	@sleep 5
	@make health
