#!/bin/bash

# Docker deployment script for frontend-portal
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

# Get version from package.json
VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "latest")

# Check if registry is provided
if [ -z "$REGISTRY" ]; then
  echo -e "${RED}❌ Error: DOCKER_REGISTRY environment variable not set${NC}"
  echo -e "${YELLOW}Usage: DOCKER_REGISTRY=your-registry.com ./docker-deploy.sh${NC}"
  echo -e "${YELLOW}Or set it in your environment: export DOCKER_REGISTRY=your-registry.com${NC}"
  exit 1
fi

echo -e "${BLUE}Deploying frontend-portal to registry: ${REGISTRY}${NC}"
echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Image Name: ${IMAGE_NAME}"
echo -e "  Version: ${VERSION}"
echo -e "  Registry: ${REGISTRY}"
echo -e "  Platform: ${PLATFORM}"
echo ""

# Check if images exist locally
if ! docker image inspect ${IMAGE_NAME}:${VERSION} >/dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Image ${IMAGE_NAME}:${VERSION} not found locally. Building first...${NC}"
  ./docker-build.sh
fi

# Login to registry (if needed)
echo -e "${BLUE}Checking registry authentication...${NC}"
if ! docker info | grep -q "Registry:"; then
  echo -e "${YELLOW}Please ensure you are logged in to the registry:${NC}"
  echo -e "${BLUE}docker login ${REGISTRY}${NC}"
fi

# Push images
echo -e "${BLUE}Pushing images to registry...${NC}"

echo -e "${YELLOW}Pushing ${REGISTRY}/${IMAGE_NAME}:${VERSION}...${NC}"
docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}

echo -e "${YELLOW}Pushing ${REGISTRY}/${IMAGE_NAME}:latest...${NC}"
docker push ${REGISTRY}/${IMAGE_NAME}:latest

# Optional: Push development image
if docker image inspect ${IMAGE_NAME}:dev >/dev/null 2>&1; then
  echo -e "${YELLOW}Pushing ${REGISTRY}/${IMAGE_NAME}:dev...${NC}"
  docker push ${REGISTRY}/${IMAGE_NAME}:dev
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Deployed images:${NC}"
echo -e "  ${REGISTRY}/${IMAGE_NAME}:${VERSION}"
echo -e "  ${REGISTRY}/${IMAGE_NAME}:latest"
echo ""
echo -e "${YELLOW}To deploy on target server:${NC}"
echo -e "${BLUE}docker pull ${REGISTRY}/${IMAGE_NAME}:latest${NC}"
echo -e "${BLUE}docker run -d -p 3000:80 --name frontend-portal ${REGISTRY}/${IMAGE_NAME}:latest${NC}"
echo ""
echo -e "${YELLOW}Or using docker-compose on target server:${NC}"
echo -e "${BLUE}DOCKER_REGISTRY=${REGISTRY} docker-compose pull${NC}"
echo -e "${BLUE}DOCKER_REGISTRY=${REGISTRY} docker-compose up -d${NC}" 