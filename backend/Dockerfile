FROM node:26

RUN npm install -g corepack && corepack enable

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter backend build

EXPOSE 3001
CMD ["sh", "-c", "pnpm db:migrate && node backend/dist/apps/api/main.js"]
