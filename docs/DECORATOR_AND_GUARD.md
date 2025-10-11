
# Auth and role guards



### 1. Global Guards

We have two global guards, configured in `AppModule`:

```ts
providers: [
  { provide: APP_GUARD, useClass: JwtAuthGuard },
  { provide: APP_GUARD, useClass: RolesGuard },
],
```

* `JwtAuthGuard` authenticates every incoming request by validating the JWT in the `Authorization: Bearer <token>` header.
* `RolesGuard` checks if the authenticated user has the required roles based on the `@Role()` decorator.

Because they’re **global**, you **do not** need to add `@UseGuards(JwtAuthGuard)` or `@UseGuards(RolesGuard)` in your controllers anymore.
They run automatically on all routes.

---

### 2. Public Routes

If a route should be accessible without authentication, mark it with the `@Public()` decorator:

```ts
@Get('health')
@Public()
getHealth() {
  return { status: 'ok' }
}
```

---

### 3. Role-Based Access Control

To restrict routes by user role, use the `@Role()` decorator.
Warning: do not need to add useGuards anymore, we already applied it globally

Example:

```ts
import { Controller, Get } from '@nestjs/common'
import { Role } from '@/common/decorators/role.decorator'
import { RoleEnum } from '@/common/enums/role.enum'

@Controller('admin')
export class AdminController {
  @Get('reports')
  @Role(RoleEnum.ADMIN)
  getAdminReports() {
    return 'Only admins can see this'
  }
}
```

How it works:

* The `@Role()` decorator sets metadata on the route.
* The global `RolesGuard` reads that metadata and compares it against the user’s role from the JWT payload.

---

### 4. Getting the Current User

Use the `@CurrentUser()` decorator to access the decoded JWT user inside your controllers or services.
This decorator read
``` Bearer token``` from frontend

Examples:

```ts
@Get('me')
getProfile(@CurrentUser() user) {
  return user
}

// You can also access a specific field
@Get('id')
getEmail(@CurrentUser('id') email: string) {
  return email
}
```


---

### 5. JWT Payload Structure

The JWT payload returned by `JwtStrategy.validate()` looks like this:

```ts
{
  id: string //Account id! not Customer/Prophet ID
  username: string
  email: string
  role: RoleEnum
}
```

This is what `@CurrentUser()` can access.

---

## Summary

| Concern        | Decorator / Mechanism     | Description                                        |
| -------------- | ------------------------- | -------------------------------------------------- |
| Authentication | **Global `JwtAuthGuard`** | Automatically verifies JWT for every route         |
| Authorization  | **Global `RolesGuard`**   | Checks required roles via `@Role()` decorator      |
| Public Access  | **`@Public()`**           | Skips authentication for the route                 |
| User Access    | **`@CurrentUser()`**      | Injects decoded JWT user object into route handler |

---

### 💡 Example: Full Flow

```ts
@Controller('reports')
export class ReportsController {
  // Protected route – requires valid JWT and admin role
  @Get()
  @Role(RoleEnum.ADMIN)
  getReports(@CurrentUser() user) {
    return { message: `Welcome ${user.username}, here are the reports.` }
  }

  // Public route – no auth required
  @Get('public')
  @Public()
  getPublicReports() {
    return ['public-data']
  }
}
```

---

### ⚠️ Notes for Developers

* Do **not** use `@UseGuards(JwtAuthGuard)` manually — it’s already applied globally.
* Always use the `@Role()` decorator for access control instead of writing custom guard logic.
* Use `@CurrentUser()` instead of directly accessing `req.user` unless you specifically need the raw `Request` object.
* Ensure all non-public routes include a valid `Authorization: Bearer <token>` header when testing with Postman or frontend.

