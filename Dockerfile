# ── 1) Builder ──────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Copy package manifests & install deps
COPY package.json package-lock.json ./
RUN npm ci

# 2. Copy Nest/TypeScript config
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

# 3. Copy Prisma schema & generate client
COPY prisma ./prisma
RUN npx prisma generate

# 4. Copy source code
COPY src ./src

# 5. Build your Nest app
RUN npm run build   # now tsconfig.json is present, so this will succeed

# ── 2) Runtime ──────────────────────────────────────────────
FROM node:18-alpine
WORKDIR /app

# 1. Copy package manifests & install only prod deps
COPY package.json package-lock.json ./
RUN npm ci --production

# 2. Copy compiled app + Prisma client + schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main.js"]
