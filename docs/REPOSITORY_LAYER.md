## `select` in Repository Methods

If any service want to use repository methods that require a **`select` object**.
This is a Prisma feature that lets you choose which fields you want returned from the database.

### Example: ```CustomerRepository.findByAccountId```

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