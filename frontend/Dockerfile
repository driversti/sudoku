# Multi-stage build for production-optimized frontend image

# Stage 1: Build the application
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source files
COPY . .

# Build the application
# Use relative path for API so nginx proxies it to backend
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Production image with nginx
FROM nginx:1.27-alpine AS runner

# Install bash for healthcheck and wget for health checks
RUN apk add --no-cache bash wget

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions for nginx user (for worker processes)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chmod 644 /etc/nginx/conf.d/default.conf

# Don't switch user - nginx master process runs as root, workers as nginx
# USER directive is already in /etc/nginx/nginx.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Run nginx (master process runs as root, workers as nginx user)
CMD ["nginx", "-g", "daemon off;"]
