# Sudoku Web - Docker Deployment Guide

This guide covers deploying the Sudoku web application using Docker and Docker Compose, including pushing images to a private registry at `registry.yurii.live`.

## Prerequisites

- Docker 24.0+
- Docker Compose 2.20+
- Access to registry.yurii.live
- (Optional) Domain name with SSL/TLS certificates

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sudoku-web
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure at minimum:

```bash
# Generate a secure JWT secret (use: openssl rand -base64 32)
JWT_SECRET=your_secure_random_string_here

# Registry URL (include trailing slash if needed, or leave empty for local build)
REGISTRY_URL=
IMAGE_TAG=latest
```

### 3. Build and Run

```bash
docker compose up -d
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

## Architecture

```
┌─────────────────┐
│   Nginx (80)    │ ← Frontend (React)
└─────────────────┘
         │
         ↓
┌─────────────────┐
│  Backend (3001) │ ← Node.js/Express API
└─────────────────┘
         │
         ↓
┌─────────────────┐
│ PostgreSQL (5432)│ ← Database
└─────────────────┘
```

## Pushing Images to Registry

### Build and Tag Images

```bash
# Set your registry URL
export REGISTRY_URL="registry.yurii.live/"
export IMAGE_TAG="v1.0.0"  # or use "latest"

# Build all images with tags
docker compose build

# Tag images for registry
docker tag sudoku-backend ${REGISTRY_URL}sudoku-backend:${IMAGE_TAG}
docker tag sudoku-frontend ${REGISTRY_URL}sudoku-frontend:${IMAGE_TAG}
```

### Push to Registry

```bash
# Login to registry (first time only)
docker login registry.yurii.live

# Push images
docker push ${REGISTRY_URL}sudoku-backend:${IMAGE_TAG}
docker push ${REGISTRY_URL}sudoku-frontend:${IMAGE_TAG}
```

### Using Registry Images in Docker Compose

Update your `.env` file:

```bash
REGISTRY_URL=registry.yurii.live/
IMAGE_TAG=v1.0.0
```

Then deploy:

```bash
docker compose pull
docker compose up -d
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REGISTRY_URL` | Custom registry URL | empty |
| `IMAGE_TAG` | Image tag to use | `latest` |
| `POSTGRES_USER` | PostgreSQL username | `sudoku` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `sudoku_password` |
| `POSTGRES_DB` | PostgreSQL database | `sudoku` |
| `POSTGRES_PORT` | PostgreSQL host port | `5432` |
| `BACKEND_PORT` | Backend host port | `3001` |
| `FRONTEND_PORT` | Frontend host port | `8080` |
| `JWT_SECRET` | JWT signing secret | **REQUIRED** |
| `JWT_EXPIRES_IN` | Token expiry time | `30d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:8080` |
| `VITE_API_URL` | Frontend API URL | `http://localhost:3001/api` |

### Database Migrations

The backend runs Prisma migrations automatically on startup. To run migrations manually:

```bash
docker compose exec backend npx prisma migrate deploy
```

To create a new migration:

```bash
docker compose exec backend npx prisma migrate dev --name migration_name
```

### Health Checks

All services include health checks:

```bash
# Check health status
docker compose ps

# View health check logs
docker compose logs backend | grep health
```

## Production Deployment

### 1. Secure Configuration

Generate secure passwords and secrets:

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate database password
openssl rand -base64 16
```

Update `.env`:

```bash
JWT_SECRET=<generated_jwt_secret>
POSTGRES_PASSWORD=<generated_db_password>
```

### 2. Use External PostgreSQL (Optional)

For production, use a managed database service. Update `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      DATABASE_URL: postgresql://user:pass@external-db-host:5432/dbname
```

Remove the `db` service from docker-compose.yml.

### 3. SSL/TLS with Traefik (Recommended)

Create `docker-compose.prod.yml`:

```yaml
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=your@email.com"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"

  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`sudoku.yourdomain.com`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=myresolver"

  backend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.sudoku.yourdomain.com`)"
      - "traefik.http.routers.backend.entrypoints=websecure"
      - "traefik.http.routers.backend.tls.certresolver=myresolver"
```

Deploy with:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 4. Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 128M
        reservations:
          cpus: '0.25'
          memory: 64M

  db:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '1'
          memory: 512M
```

## Operations

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart backend
```

### Update Application

```bash
# Pull new images
docker compose pull

# Rebuild and restart
docker compose up -d --build

# Or with specific tags
IMAGE_TAG=v1.0.1 docker compose up -d
```

### Database Backup

```bash
# Backup
docker compose exec db pg_dump -U sudoku sudoku > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
docker compose exec -T db psql -U sudoku sudoku < backup_file.sql
```

### Stop and Remove

```bash
# Stop services
docker compose down

# Stop and remove volumes (WARNING: deletes database data)
docker compose down -v
```

## Monitoring

### Container Statistics

```bash
docker stats
```

### Database Queries

```bash
# Connect to PostgreSQL
docker compose exec db psql -U sudoku -d sudoku

# Common queries
\dt                    # List tables
SELECT COUNT(*) FROM "Player";  # Count players
SELECT * FROM "Score" ORDER BY "timeSeconds" ASC LIMIT 10;  # Top scores
```

## Troubleshooting

### Frontend Can't Connect to Backend

1. Check `VITE_API_URL` in `.env`
2. Verify backend is healthy: `docker compose ps`
3. Check backend logs: `docker compose logs backend`

### Database Connection Errors

1. Verify PostgreSQL is healthy: `docker compose ps`
2. Check database logs: `docker compose logs db`
3. Verify `DATABASE_URL` in backend environment

### Build Failures

1. Clear Docker cache: `docker builder prune -a`
2. Rebuild without cache: `docker compose build --no-cache`

### Permission Issues

If you encounter permission issues with volumes:

```bash
docker compose down
docker volume rm sudoku-web_postgres_data
docker compose up -d
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Push

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to registry
        uses: docker/login-action@v3
        with:
          registry: registry.yurii.live
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}

      - name: Build and push backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: registry.yurii.live/sudoku-backend:${{ github.ref_name }}

      - name: Build and push frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: registry.yurii.live/sudoku-frontend:${{ github.ref_name }}
```

## Security Considerations

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use strong passwords** - Generate secure random passwords
3. **Enable SSL/TLS** - Use reverse proxy with HTTPS
4. **Restrict network access** - Use firewall rules
5. **Keep images updated** - Regularly update base images
6. **Scan for vulnerabilities** - Use `docker scan` or Trivy
7. **Limit container resources** - Prevent DoS attacks
8. **Use read-only filesystems** - Where possible

## Performance Tuning

### PostgreSQL Tuning

Add to `docker-compose.yml` under `db` service:

```yaml
command:
  - "-c shared_buffers=256MB"
  - "-c effective_cache_size=1GB"
  - "-c maintenance_work_mem=64MB"
  - "-c checkpoint_completion_target=0.9"
  - "-c wal_buffers=16MB"
  - "-c default_statistics_target=100"
  - "-c random_page_cost=1.1"
  - "-c effective_io_concurrency=200"
  - "-c work_mem=1310kB"
  - "-c min_wal_size=1GB"
  - "-c max_wal_size=4GB"
```

### Nginx Caching

The nginx configuration includes caching headers. For additional caching, consider adding a CDN like Cloudflare.

## Support

For issues or questions:
- Check logs: `docker compose logs -f`
- Verify health: `docker compose ps`
- Review configuration: `docker compose config`

## License

[Your License Here]
