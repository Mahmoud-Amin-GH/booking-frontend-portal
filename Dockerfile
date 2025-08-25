# Build stage
FROM --platform=linux/amd64 node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Build arguments for environment variables
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_FORSALE_API_BASE_URL
ARG REACT_APP_FORSALE_DEVELOPMENT_API_BASE_URL
ARG REACT_APP_FORSALE_API_KEY
ARG REACT_APP_FORSALE_API_SECRET
ARG REACT_APP_ENV

# Set environment variables
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_FORSALE_API_BASE_URL=$REACT_APP_FORSALE_API_BASE_URL
ENV REACT_APP_FORSALE_DEVELOPMENT_API_BASE_URL=$REACT_APP_FORSALE_DEVELOPMENT_API_BASE_URL
ENV REACT_APP_FORSALE_API_KEY=$REACT_APP_FORSALE_API_KEY
ENV REACT_APP_FORSALE_API_SECRET=$REACT_APP_FORSALE_API_SECRET
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV NODE_ENV=$REACT_APP_ENV

# Build the application
RUN npm run build

# Production stage
FROM --platform=linux/amd64 nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set ownership and create necessary directories
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 