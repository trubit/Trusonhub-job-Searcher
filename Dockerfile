# ─── Stage 1: Install all dependencies ───────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --frozen-lockfile

# ─── Stage 2: Build the client (Vite) ────────────────────────────────────────
FROM node:20-alpine AS client-build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:client

# ─── Stage 3: Production server ───────────────────────────────────────────────
FROM node:20-alpine AS server-prod
WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production deps only
COPY package*.json ./
RUN npm ci --frozen-lockfile --omit=dev

# Copy built client assets for static serving (optional — Nginx handles this)
COPY --from=client-build /app/dist/client ./dist/client

# Copy TypeScript source (server compiled at runtime via tsx in prod image)
# For true prod: compile first with tsc, then copy dist/server
COPY src/server ./src/server
COPY src/shared ./src/shared
COPY tsconfig.json ./
COPY tsconfig.server.json ./

# Create logs directory
RUN mkdir -p logs && chown node:node logs

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "--loader", "tsx", "src/server/index.ts"]
