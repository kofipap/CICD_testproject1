# ── Stage 1: base image ────────────────────────────────────────────────────────
FROM node:18-alpine AS base

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifest first (layer-cache friendly)
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# ── Stage 2: final image ────────────────────────────────────────────────────────
FROM node:18-alpine

WORKDIR /app

# Copy installed node_modules from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy application source files
COPY server.js .
COPY data.json .
COPY package.json .

# Expose the port the app listens on
EXPOSE 3000

# Run as non-root user for security
USER node

# Start the server
CMD ["node", "server.js"]
