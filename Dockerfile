# Child Safety QR Backend - Production Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src
# Ensure uploads dir exists at runtime
RUN mkdir -p uploads

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "src/server.js"]
