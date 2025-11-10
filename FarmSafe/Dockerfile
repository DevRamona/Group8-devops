FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./backend/

RUN cd backend && npm ci

COPY backend ./backend

RUN cd backend && npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY backend/package*.json ./backend/

RUN cd backend && npm ci --only=production

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/src/pictures ./backend/src/pictures

RUN addgroup -S nodejs && adduser -S nodejs -G nodejs \
    && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

CMD ["node", "backend/dist/server.js"]

