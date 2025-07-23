# ── 1) Builder ──────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Install deps
COPY package.json package-lock.json ./
RUN npm ci

# 2. Copy code & generate Prisma client
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate

# 3. Build
RUN npm run build

# ── 2) Runtime ──────────────────────────────────────────────
FROM node:18-alpine
WORKDIR /app

# Copy built assets + prod deps
COPY package.json package-lock.json ./
RUN npm ci --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate client at runtime (ensures matching schema)
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "dist/main.js"]
