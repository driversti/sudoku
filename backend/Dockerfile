# Multi-stage build for production-optimized backend image

# Stage 1: Build TypeScript
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source files
COPY . .

# Generate Prisma client first
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init openssl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001 && \
    mkdir -p /app/dist && \
    chown -R backend:nodejs /app

# Copy package files and install production dependencies only
COPY --from=builder --chown=backend:nodejs /app/package.json ./
COPY --from=builder --chown=backend:nodejs /app/package-lock.json ./
RUN npm ci --only=production

# Copy built files and Prisma
COPY --from=builder --chown=backend:nodejs /app/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/prisma ./prisma
COPY --from=builder --chown=backend:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Switch to non-root user
USER backend

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
