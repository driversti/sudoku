#!/bin/bash

# Sudoku Web - Quick Deployment Script
# This script helps build, tag, and push Docker images to registry.yurii.live

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGISTRY_URL="registry.yurii.live/"
IMAGE_TAG=${IMAGE_TAG:-"latest"}
PROJECT_NAME="sudoku-web"

echo -e "${GREEN}=== Sudoku Web - Docker Deployment ===${NC}"
echo ""

# Function to print colored messages
print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_info ".env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_success "Created .env file. Please edit it with your configuration."
        print_info "At minimum, set a secure JWT_SECRET:"
        echo "  JWT_SECRET=$(openssl rand -base64 32)"
        echo ""
        read -p "Press Enter after editing .env file..."
    else
        print_error ".env.example not found!"
        exit 1
    fi
fi

# Load environment variables
print_info "Loading environment variables..."
export $(cat .env | grep -v '^#' | xargs)

# Check for required variables
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" == "change_this_to_a_secure_random_string" ]; then
    print_error "JWT_SECRET is not set or using default value!"
    print_info "Generate a secure secret:"
    echo "  openssl rand -base64 32"
    exit 1
fi

# Parse command line arguments
COMMAND=${1:-"help"}

case $COMMAND in
    build)
        print_info "Building Docker images..."
        docker compose build
        print_success "Build complete!"
        ;;

    push)
        print_info "Building and pushing images to ${REGISTRY_URL}..."

        # Build images
        print_info "Building images..."
        docker compose build

        # Tag images
        print_info "Tagging images..."
        docker tag sudoku-backend ${REGISTRY_URL}sudoku-backend:${IMAGE_TAG}
        docker tag sudoku-frontend ${REGISTRY_URL}sudoku-frontend:${IMAGE_TAG}

        # Push images
        print_info "Pushing backend image..."
        docker push ${REGISTRY_URL}sudoku-backend:${IMAGE_TAG}

        print_info "Pushing frontend image..."
        docker push ${REGISTRY_URL}sudoku-frontend:${IMAGE_TAG}

        print_success "Images pushed successfully!"
        print_info "Images:"
        echo "  ${REGISTRY_URL}sudoku-backend:${IMAGE_TAG}"
        echo "  ${REGISTRY_URL}sudoku-frontend:${IMAGE_TAG}"
        ;;

    deploy)
        print_info "Deploying from registry..."
        print_info "Pulling images..."
        docker pull ${REGISTRY_URL}sudoku-backend:${IMAGE_TAG}
        docker pull ${REGISTRY_URL}sudoku-frontend:${IMAGE_TAG}

        print_info "Starting services..."
        docker compose up -d

        print_success "Deployment complete!"
        print_info "Services:"
        echo "  Frontend: http://localhost:${FRONTEND_PORT:-8080}"
        echo "  Backend:  http://localhost:${BACKEND_PORT:-3001}"
        ;;

    start|up)
        print_info "Starting services..."
        docker compose up -d
        print_success "Services started!"
        make health 2>/dev/null || echo "Run 'make health' or './deploy.sh health' to check status"
        ;;

    stop|down)
        print_info "Stopping services..."
        docker compose down
        print_success "Services stopped!"
        ;;

    restart)
        print_info "Restarting services..."
        docker compose restart
        print_success "Services restarted!"
        ;;

    logs)
        docker compose logs -f
        ;;

    status|health)
        echo ""
        echo "=== Container Status ==="
        docker compose ps
        echo ""
        echo "=== Health Checks ==="
        echo -n "Backend:  "
        curl -s http://localhost:${BACKEND_PORT:-3001}/health && echo " ✓" || echo " ✗"
        echo -n "Frontend: "
        curl -s http://localhost:${FRONTEND_PORT:-8080}/health && echo " ✓" || echo " ✗"
        echo ""
        ;;

    backup)
        print_info "Backing up database..."
        BACKUP_DIR="backups"
        mkdir -p ${BACKUP_DIR}
        BACKUP_FILE="${BACKUP_DIR}/backup_$(date +%Y%m%d_%H%M%S).sql"
        docker compose exec -T db pg_dump -U ${POSTGRES_USER:-sudoku} ${POSTGRES_DB:-sudoku} > ${BACKUP_FILE}
        print_success "Backup saved to: ${BACKUP_FILE}"
        ;;

    clean)
        print_info "Cleaning up stopped containers and dangling images..."
        docker compose down
        docker container prune -f
        docker image prune -f
        print_success "Cleanup complete!"
        ;;

    reset)
        print_error "WARNING: This will delete all data including the database!"
        read -p "Are you sure? (type 'yes' to confirm): " confirm
        if [ "$confirm" == "yes" ]; then
            print_info "Resetting everything..."
            docker compose down -v
            docker system prune -af
            print_success "Reset complete!"
        else
            print_info "Reset cancelled."
        fi
        ;;

    help|*)
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  build     - Build Docker images"
        echo "  push      - Build and push images to registry"
        echo "  deploy    - Pull images from registry and deploy"
        echo "  start/up  - Start all services"
        echo "  stop/down - Stop all services"
        echo "  restart   - Restart all services"
        echo "  logs      - View logs from all services"
        echo "  status    - Show service status and health"
        echo "  health    - Same as status"
        echo "  backup    - Backup the database"
        echo "  clean     - Clean up stopped containers and images"
        echo "  reset     - Remove everything (DESTRUCTIVE!)"
        echo "  help      - Show this help message"
        echo ""
        echo "Environment Variables:"
        echo "  IMAGE_TAG - Image tag to use (default: latest)"
        echo ""
        echo "Examples:"
        echo "  $0 build                    # Build images locally"
        echo "  $0 push                     # Push to registry with 'latest' tag"
        echo "  IMAGE_TAG=v1.0.0 $0 push    # Push with specific tag"
        echo "  $0 deploy                   # Deploy from registry"
        echo "  $0 up                       # Start services"
        echo "  $0 logs                     # View logs"
        echo ""
        ;;
esac
