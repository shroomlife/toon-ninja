# Multi-stage build for TOON Viewer SPA
# Stage 1: Build
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Runtime
FROM oven/bun:latest

WORKDIR /app

# Install a lightweight static server for SPA
RUN bun pm trust --all && \
    bun add -g sirv-cli

# Copy built application from builder stage
COPY --from=builder /app/.output ./app

# Expose port for development/testing
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun -e "fetch('http://localhost:3000/').then(() => process.exit(0)).catch(() => process.exit(1))"

# Serve the SPA
CMD ["sirv", "app/public", "--single", "--host", "0.0.0.0", "--port", "3000"]
