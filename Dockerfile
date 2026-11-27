FROM node:22-slim

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["./node_modules/.bin/tsx", "server.ts"]
