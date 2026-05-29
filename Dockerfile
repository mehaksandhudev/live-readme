# ==========================================
# STAGE 1: Build compilation
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency mappings
COPY package*.json ./
RUN npm ci

# Copy full application code
COPY . .

# Compile optimized static bundle
RUN npm run build

# ==========================================
# STAGE 2: High Performance Asset Server
# ==========================================
FROM nginx:alpine-slim

# Copy compiled assets from builder stage into Nginx static root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a lightweight custom Nginx router config to prevent routing errors
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
