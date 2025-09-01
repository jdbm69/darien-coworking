# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Dependencias ----
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Build ----
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000
# Usa el script "start" de package.json (debe ser "next start")
CMD ["npm", "run", "start"]
