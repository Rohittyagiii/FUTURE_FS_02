# =========================
# Build Stage
# =========================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for Docker cache
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Backend API URL
ARG VITE_API_URL=https://future-fs-02-2-anp7.onrender.com
ENV VITE_API_URL=$VITE_API_URL

# Build React/Vite application
RUN npm run build


# =========================
# Production Stage
# =========================
FROM nginx:alpine

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite production build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]