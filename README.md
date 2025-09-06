# First Time

```
docker-compose up -d
pnpm i
pnpx prisma generate
pnpx prisma migrate dev
pnpm run db:seed
```

# Others

```
docker-compose up -d
pnpx prisma migrate dev (if there any change in backend schema)
```

# if ERROR

if ERROR you may have to reset schema first

```
pnpx prisma migrate reset
pnpx prisma migrate dev
```

# Reset DB

```
docker-compose up -d
pnpx prisma migrate dev (if there any change in backend schema)
pnpm run db:seed clear
pnpm run db:seed
```

# Seed

### Seed all tables
```
pnpm run db:seed
```
### Clear all tables
```
pnpm run db:seed clear
```
### Seed specific table
```
pnpm run db:seed [tableName]
```
### Clear specific table
```
pnpm run db:seed clear [tableName]
```
### Seed dev data
```
pnpm run db:seed:dev
```
# Dev accounts
```
dev_customer , pass : dev_password
dev_prophet , pass : dev_password
dev_admin , pass : dev_password
```
# Transform Interceptor

Automatically formats controller responses into a consistent API structure.

## How it works

The interceptor wraps your controller responses based on what you return:

| Controller Returns | Response Format |
|---|---|
| Any raw data | `{ "data": yourData }` |
| `{ message: "..." }` | `{ "message": "..." }` (unchanged) |
| `{ data: {...} }` | `{ "data": {...} }` (unchanged) |
| `{ message: "...", data: {...} }` | `{ "message": "...", "data": {...} }` (unchanged) |
| `null` or `undefined` | `{}` (empty object) |


This apply globally for every api response!

```typescript
// main.ts
app.useGlobalInterceptors(new TransformInterceptor())
```