# 🎮 Sudoku Web - Docker Quick Start

Quick start guide for running Sudoku Web with Docker.

## 🚀 Quick Start (5 minutes)

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env and set JWT_SECRET

# 2. Start the application
docker compose up -d

# 3. Open in browser
open http://localhost:8080
```

That's it! 🎉

## 📦 Available Commands

### Using Make (Recommended)

```bash
make help              # Show all commands
make build             # Build images
make up                # Start services
make down              # Stop services
make logs              # View logs
make health            # Check health
make backup            # Backup database
```

### Using deploy.sh Script

```bash
./deploy.sh help       # Show all commands
./deploy.sh build      # Build images
./deploy.sh up         # Start services
./deploy.sh logs       # View logs
./deploy.sh health     # Check health
```

### Using Docker Compose

```bash
docker compose up -d           # Start
docker compose down            # Stop
docker compose logs -f         # Logs
docker compose ps              # Status
```

## 📤 Push to Registry

### Push to registry.yurii.live

```bash
# Using deploy.sh
IMAGE_TAG=v1.0.0 ./deploy.sh push

# Or manually
docker compose build
docker tag sudoku-backend registry.yurii.live/sudoku-backend:v1.0.0
docker tag sudoku-frontend registry.yurii.live/sudoku-frontend:v1.0.0
docker push registry.yurii.live/sudoku-backend:v1.0.0
docker push registry.yurii.live/sudoku-frontend:v1.0.0
```

### Deploy from Registry

```bash
# Set registry in .env
echo "REGISTRY_URL=registry.yurii.live/" >> .env
echo "IMAGE_TAG=v1.0.0" >> .env

# Deploy
./deploy.sh deploy
```

## 🔧 Configuration

Edit `.env` file:

```bash
# Required
JWT_SECRET=your_secure_secret_here

# Optional
POSTGRES_PASSWORD=sudoku_password
FRONTEND_PORT=8080
BACKEND_PORT=3001
```

Generate secure secrets:

```bash
# JWT secret
openssl rand -base64 32

# Database password
openssl rand -base64 16
```

## 📊 Service URLs

After starting:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

## 🐛 Troubleshooting

### Port already in use

```bash
# Change ports in .env
FRONTEND_PORT=8081
BACKEND_PORT=3002
```

### Database connection errors

```bash
# Check database is healthy
docker compose ps

# View database logs
docker compose logs db
```

### Reset everything

```bash
# WARNING: Deletes all data
make reset
# or
./deploy.sh reset
```

## 📚 Full Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guide.

## 🔐 Security

- Never commit `.env` file
- Use strong passwords
- Enable SSL/TLS in production
- Keep images updated

## 📝 License

[Your License Here]
