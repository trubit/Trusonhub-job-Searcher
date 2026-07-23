# ─── Stage 1: Install all dependencies ───────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --frozen-lockfile

# ─── Stage 2: Build the client (Vite) ────────────────────────────────────────
FROM node:22-alpine AS client-build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:client

# ─── Stage 3: Production server ───────────────────────────────────────────────
FROM node:22-alpine AS server-prod
WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production deps only
COPY package*.json ./
RUN npm ci --frozen-lockfile --omit=dev

# Copy built client assets for static serving
COPY --from=client-build /app/dist/client ./dist/client

# Copy TypeScript source
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
