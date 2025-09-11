# Seed DB

## First Time

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

---

# API Response

## Success Response

Automatically formats controller **success responses** into a consistent API structure like this.

| Controller Returns    | Response Format                   |
| --------------------- | --------------------------------- |
| Any raw data          | `{ "data": yourData }`            |
| `{ data: {...} }`     | `{ "data": {...} }` (unchanged)   |
| `null` or `undefined` | `{ "data": null }` (empty object) |

So basically, all response will look like this

```json
{
  "data": {
    "somekey": "somevalue"
  }
}
```

This apply globally for every success api response.

## Error Response

NestJS has a built-in **exception layer**.
If a service/controller throws an exception, NestJS will catch it and return a structured JSON response.

**Example: Unauthorized**

```ts
import { UnauthorizedException } from "@nestjs/common";

@Get("protected")
findProtected() {
  throw new UnauthorizedException("Invalid token");
}
```

**Response:**

```json
{
  "statusCode": 401,
  "message": "Invalid token",
  "error": "Unauthorized"
}
```

---

# `select` in Repository Methods

If any service want to use repository methods that require a **`select` object**.
This is a Prisma feature that lets you choose which fields you want returned from the database.

## Example: `CustomerRepository.findByAccountId`

```ts
findByAccountId<S extends Prisma.CustomerSelect>(
    accountId: string,
    select: S //This function required select object
  ): Promise<Prisma.CustomerGetPayload<{ select: S }> | null> {
    return this.prisma.customer.findUnique({
      where: { accountId },
      select,
    })
  }
```

How to use this function

```ts
const customer = await customerRepository.findByAccountId("account-123", {
  id: true,
  name: true,
  email: true,
}) //Specify which fields you need
```

Result will only contain the selected fields:

```json
{
  "id": "customer-1",
  "name": "Alice",
  "email": "alice@example.com"
}
```

---

```
# API Response

## Success Response
Automatically formats controller **success responses** into a consistent API structure like this.


| Controller Returns | Response Format |
|---|---|
| Any raw data | `{ "data": yourData }` |
| `{ data: {...} }` | `{ "data": {...} }` (unchanged) |
| `null` or `undefined` | `{}` (empty object) |

So basically, all response will look like this
```

{ "data" :
{
"somekey" : "somevalue"
}
}

```
This apply globally for every success api response.


## Error Response
NestJS has a built-in **exception layer**.
If a service/controller throws an exception, NestJS will catch it and return a structured JSON response.

**Example: Unauthorized**
```

import { UnauthorizedException } from "@nestjs/common";

@Get("protected")
findProtected() {
throw new UnauthorizedException("Invalid token");
}

```


**Response:**
```

{
"statusCode": 401,
"message": "Invalid token",
"error": "Unauthorized"
}

```

```
