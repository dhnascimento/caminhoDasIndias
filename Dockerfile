# ============================================
# MULTI-STAGE DOCKERFILE
# ============================================
# This Dockerfile creates a lightweight nginx container
# serving the static slideshow build.
#
# To build and run locally:
#   docker build -t india-slideshow .
#   docker run -p 8080:80 india-slideshow
#
# Then visit http://localhost:8080
# ============================================

# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the static site
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS runner

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
