#!/bin/bash

# Docker build script for frontend-portal
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="frontend-portal"
REGISTRY="${DOCKER_REGISTRY:-}"
PLATFORM="linux/amd64"

# Get version from package.json or use 'latest'
VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "latest")
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Environment variables
REACT_APP_API_URL="${REACT_APP_API_URL:-https://booking-api.q84sale.com/api}"
REACT_APP_ENV="${REACT_APP_ENV:-production}"

echo -e "${BLUE}Building Docker image for frontend-portal...${NC}"
echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Image Name: ${IMAGE_NAME}"
echo -e "  Version: ${VERSION}"
echo -e "  Platform: ${PLATFORM}"
echo -e "  API URL: ${REACT_APP_API_URL}"
echo -e "  Environment: ${REACT_APP_ENV}"
echo -e "  Build Date: ${BUILD_DATE}"
echo -e "  Commit: ${COMMIT_SHA}"
echo ""

# Build production image
echo -e "${BLUE}Building production image...${NC}"
docker build \
  --platform ${PLATFORM} \
  --build-arg REACT_APP_API_URL="${REACT_APP_API_URL}" \
  --build-arg REACT_APP_ENV="${REACT_APP_ENV}" \
  --label "version=${VERSION}" \
  --label "build-date=${BUILD_DATE}" \
  --label "commit-sha=${COMMIT_SHA}" \
  -t ${IMAGE_NAME}:${VERSION} \
  -t ${IMAGE_NAME}:latest \
  -f Dockerfile \
  .

# Build development image
echo -e "${BLUE}Building development image...${NC}"
docker build \
  --platform ${PLATFORM} \
  --build-arg REACT_APP_API_URL="${REACT_APP_API_URL}" \
  --label "version=${VERSION}" \
  --label "build-date=${BUILD_DATE}" \
  --label "commit-sha=${COMMIT_SHA}" \
  -t ${IMAGE_NAME}:dev \
  -f Dockerfile.dev \
  .

# Tag with registry if provided
if [ ! -z "$REGISTRY" ]; then
  echo -e "${BLUE}Tagging images for registry: ${REGISTRY}${NC}"
  docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY}/${IMAGE_NAME}:${VERSION}
  docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:latest
  docker tag ${IMAGE_NAME}:dev ${REGISTRY}/${IMAGE_NAME}:dev
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo -e "${YELLOW}Built images:${NC}"
docker images ${IMAGE_NAME}

echo ""
echo -e "${YELLOW}To run the container:${NC}"
echo -e "  Production: ${BLUE}docker run -p 3000:80 ${IMAGE_NAME}:latest${NC}"
echo -e "  Development: ${BLUE}docker run -p 3001:3000 ${IMAGE_NAME}:dev${NC}"
echo -e "  Docker Compose: ${BLUE}docker-compose up${NC}"

if [ ! -z "$REGISTRY" ]; then
  echo ""
  echo -e "${YELLOW}To push to registry:${NC}"
  echo -e "  ${BLUE}docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}${NC}"
  echo -e "  ${BLUE}docker push ${REGISTRY}/${IMAGE_NAME}:latest${NC}"
fi 