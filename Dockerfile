# Build stage
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

ENV NODE_ENV=production

RUN bun run build

# Runtime stage - minimal image for SPA
FROM oven/bun:1-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Copy only the built output
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
