# Overall API detial

## API Success Response

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

## API Error Response

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



# API Request Authentication — Bearer Token


### Protected route (Required Token)

Include the JWT like this:

```
Authorization: Bearer <your_access_token>
```

Example:

```http
GET /account/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

If missing or invalid:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```


* `JwtAuthGuard` automatically validates your token.
* You can access it anywhere with the `@CurrentUser()` decorator.
* More detail in GUARDS_AND_DECORATOR.md


---

### Public Routes

Route that doesn't require auth will have ```@Public()```

```ts
@Public()
@Get("foo")
foo() {}
```
