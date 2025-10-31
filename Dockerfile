# ---- Base deps ----
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV HUSKY=0
ENV CI=true
ENV PNPM_SKIP_POSTINSTALL=true

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV HUSKY=0
ENV CI=true
ENV PNPM_SKIP_POSTINSTALL=true

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm prisma generate || true

RUN pnpm run build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat \
  && addgroup -S nodegrp && adduser -S nodeusr -G nodegrp

ENV NODE_ENV=production
ENV HUSKY=0
ENV CI=true
ENV PNPM_SKIP_POSTINSTALL=true
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm prune --prod --ignore-scripts

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN pnpm db:generate

ENV PORT=8000
EXPOSE 8000
USER nodeusr

CMD ["node", "dist/main.js"]

