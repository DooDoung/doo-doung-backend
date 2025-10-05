# Start project

```bash
docker-compose up -d
pnpm i
pnpx prisma generate
pnpx prisma migrate dev
pnpm run db:seed //Seed all data
[Optional] pnpm run db:seed:dev //For seed dev data
```

## Others

```bash
docker-compose up -d
pnpx prisma migrate dev (if there any change in backend schema)
```

## if ERROR

```bash
pnpx prisma migrate reset
pnpx prisma migrate dev
```

## Reset DB

```bash
docker-compose up -d
pnpx prisma migrate dev (if there any change in backend schema)
pnpm run db:seed clear
pnpm run db:seed
```

## Seed basic command

```bash
pnpm run db:seed //Seed all tables
pnpm run db:seed clear //Clear all tables
pnpm run db:seed [tableName] //Seed specific table
pnpm run db:seed clear [tableName] //Clear specific table
pnpm run db:seed:dev //Seed dev data
```

## Dev accounts

```
dev_customer , pass : dev_password
dev_prophet , pass : dev_password
dev_admin , pass : dev_password
```
