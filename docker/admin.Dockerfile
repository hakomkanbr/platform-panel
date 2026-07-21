FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && \
    npm install -g turbo
WORKDIR /app

FROM base AS pruner
COPY . .
RUN turbo prune admin --docker

FROM base AS builder
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/json/ .
RUN pnpm install --no-frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN turbo build --filter=admin

FROM base AS prod-deps
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/json/ .
RUN pnpm install --no-frozen-lockfile --prod

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/package.json ./
COPY --from=builder /app/apps/admin ./apps/admin
EXPOSE 3001
USER nextjs
WORKDIR /app/apps/admin
CMD ["pnpm", "start"]
