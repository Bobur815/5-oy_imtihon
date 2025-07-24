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

COPY src/common/uploads ./uploads

# 5. Build your Nest app
RUN npm run build   # now tsconfig.json is present, so this will succeed

# ── 2) Runtime ──────────────────────────────────────────────
FROM node:18-alpine
WORKDIR /app

# 1. Install only prod deps
COPY package.json package-lock.json ./
RUN npm ci --production

# 2. Copy the generated Prisma client from the builder
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma        ./node_modules/.prisma

# 3. Copy your Prisma schema (optional, only if you need it at runtime)
COPY --from=builder /app/prisma ./prisma

# 4. Copy the compiled app
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/uploads ./uploads

EXPOSE 3000
CMD ["node", "dist/main.js"]

