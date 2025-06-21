# Frontend Portal - Docker Setup

This document provides comprehensive instructions for building, running, and deploying the frontend-portal application using Docker.

## 📋 Prerequisites

- Docker Engine 20.10+ with BuildKit support
- Docker Compose 2.0+
- Node.js 18+ (for local development)
- Git (for version tagging)

## 🏗️ Architecture

The Docker setup includes:

- **Multi-stage Dockerfile**: Optimized production build with nginx serving
- **Development Dockerfile**: Hot-reload development environment
- **Docker Compose**: Easy orchestration for development and production
- **Build Scripts**: Automated building and deployment
- **Platform Support**: Specifically configured for `linux/amd64`

## 🚀 Quick Start

### 1. Build and Run (Production)

```bash
# Build the image
./docker-build.sh

# Run with docker-compose
docker-compose up -d

# Or run directly
docker run -p 3000:80 frontend-portal:latest
```

The application will be available at `http://localhost:3000`

### 2. Development Mode

```bash
# Run development server with hot-reload
docker-compose --profile dev up frontend-portal-dev

# Or run directly
docker run -p 3001:3000 -v $(pwd)/src:/app/src frontend-portal:dev
```

The development server will be available at `http://localhost:3001`

## 🔧 Configuration

### Environment Variables

Set these environment variables before building:

```bash
# API Configuration
export REACT_APP_API_URL="https://booking-api.q84sale.com/api"
export REACT_APP_ENV="production"

# Registry Configuration (for deployment)
export DOCKER_REGISTRY="your-registry.com"
```

### Build Arguments

The Dockerfile accepts these build arguments:

- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENV`: Environment (development/production)

## 📦 Building Images

### Using Build Script (Recommended)

```bash
# Build both production and development images
./docker-build.sh

# With custom API URL
REACT_APP_API_URL="https://api.example.com" ./docker-build.sh

# With registry tagging
DOCKER_REGISTRY="registry.example.com" ./docker-build.sh
```

### Manual Building

```bash
# Production image
docker build \
  --platform linux/amd64 \
  --build-arg REACT_APP_API_URL="https://booking-api.q84sale.com/api" \
  --build-arg REACT_APP_ENV="production" \
  -t frontend-portal:latest \
  -f Dockerfile .

# Development image
docker build \
  --platform linux/amd64 \
  -t frontend-portal:dev \
  -f Dockerfile.dev .
```

## 🚢 Deployment

### Using Deployment Script

```bash
# Set registry and deploy
export DOCKER_REGISTRY="your-registry.com"
./docker-deploy.sh
```

### Manual Deployment

```bash
# Tag for registry
docker tag frontend-portal:latest your-registry.com/frontend-portal:latest

# Push to registry
docker push your-registry.com/frontend-portal:latest

# Deploy on target server
docker pull your-registry.com/frontend-portal:latest
docker run -d -p 3000:80 --name frontend-portal your-registry.com/frontend-portal:latest
```

## 🐳 Docker Compose Usage

### Production

```bash
# Start production services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Development

```bash
# Start development services
docker-compose --profile dev up -d

# Development with logs
docker-compose --profile dev up frontend-portal-dev
```

### With Registry

```bash
# Using images from registry
DOCKER_REGISTRY="your-registry.com" docker-compose up -d
```

## 🔍 Health Checks

The application includes health checks:

- **Production**: `http://localhost:3000/health`
- **Development**: `http://localhost:3001/`

### Manual Health Check

```bash
# Check container health
docker ps
docker inspect frontend-portal --format='{{.State.Health.Status}}'

# Test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/
```

## 📊 Monitoring

### Container Logs

```bash
# View logs
docker logs frontend-portal

# Follow logs
docker logs -f frontend-portal

# With docker-compose
docker-compose logs -f frontend-portal
```

### Container Stats

```bash
# Resource usage
docker stats frontend-portal

# Detailed info
docker inspect frontend-portal
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails - Dependencies**
   ```bash
   # Clear Docker cache
   docker builder prune
   
   # Rebuild without cache
   docker build --no-cache -t frontend-portal:latest .
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :3000
   
   # Use different port
   docker run -p 3001:80 frontend-portal:latest
   ```

3. **Permission Issues**
   ```bash
   # Fix script permissions
   chmod +x docker-build.sh docker-deploy.sh
   ```

4. **Platform Issues**
   ```bash
   # Force platform
   docker build --platform linux/amd64 -t frontend-portal:latest .
   ```

### Debug Container

```bash
# Run interactive shell
docker run -it --entrypoint /bin/sh frontend-portal:latest

# Debug running container
docker exec -it frontend-portal /bin/sh
```

## 📁 File Structure

```
frontend-portal/
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development with hot-reload
├── docker-compose.yml      # Orchestration configuration
├── nginx.conf              # Nginx configuration for production
├── .dockerignore           # Files to exclude from build context
├── docker-build.sh         # Build automation script
├── docker-deploy.sh        # Deployment automation script
└── README-DOCKER.md        # This documentation
```

## 🔒 Security

The Docker setup includes:

- **Non-root user**: Container runs as non-root user
- **Security headers**: Nginx configured with security headers
- **Minimal base images**: Alpine Linux for smaller attack surface
- **No secrets in images**: Environment variables passed at runtime

## 🚀 Performance

Optimizations included:

- **Multi-stage builds**: Smaller production images
- **Layer caching**: Optimized layer order for better caching
- **Gzip compression**: Enabled in nginx
- **Static asset caching**: Long-term caching for assets
- **Health checks**: Proper health monitoring

## 📝 Maintenance

### Updating Images

```bash
# Rebuild with latest dependencies
./docker-build.sh

# Update running containers
docker-compose pull
docker-compose up -d
```

### Cleanup

```bash
# Remove unused images
docker image prune

# Remove all frontend-portal images
docker rmi $(docker images frontend-portal -q)

# Clean build cache
docker builder prune
```

## 🆘 Support

For issues related to:
- **Docker setup**: Check this README and troubleshooting section
- **Application bugs**: Check the main README.mdc
- **Deployment**: Verify environment variables and registry access

---

**Note**: This setup is optimized for `linux/amd64` platform. For other platforms, modify the `--platform` flag in Dockerfiles and scripts accordingly. 