# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Deps (instala dependencias usando lockfile) ----
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Build (compila Next a modo standalone) ----
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Runner (imagen final mínima) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV BACKEND_URL=http://back:3001

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]