# Transaction Account API Documentation

## Overview

The Transaction Account API manages payment accounts for prophets in the DooDoung platform. Each prophet can have multiple bank accounts from different Thai banks, with one designated as the default payment method.

## Base URL

```
/transaction-account
```

## Authentication

All endpoints require Bearer token authentication.

```http
Authorization: Bearer <your-token>
```

## Supported Banks

| Code  | Bank Name               |
| ----- | ----------------------- |
| BBL   | Bangkok Bank            |
| KTB   | Krungthai Bank          |
| KBANK | Kasikorn Bank           |
| SCB   | Siam Commercial Bank    |
| BAY   | Krungsri                |
| TTB   | TMBThanachart           |
| CIMB  | CIMB Thai               |
| UOB   | UOB Thai                |
| GSB   | Government Savings Bank |
| BAAC  | Bank for Agriculture    |

## Endpoints

### 1. Get Prophet's Transaction Accounts

Retrieves all payment accounts for a specific prophet.

**Endpoint:** `GET /transaction-account/prophet/{prophetId}`

**Parameters:**

- `prophetId` (path): Prophet's unique ID (16 characters)

**Example Request:**

```http
GET /transaction-account/prophet/dev_prophet_001
Authorization: Bearer <token>
```

**Example Response:**

```json
[
  {
    "id": "tx_acc_001234567",
    "prophetId": "dev_prophet_001",
    "accountName": "Main Business Account",
    "accountNumber": "1234567890",
    "bank": "KBANK",
    "isDefault": true
  },
  {
    "id": "tx_acc_987654321",
    "prophetId": "dev_prophet_001",
    "accountName": "Secondary Account",
    "accountNumber": "0987654321",
    "bank": "SCB",
    "isDefault": false
  }
]
```

### 2. Get Transaction Account by ID

Retrieves details of a specific transaction account.

**Endpoint:** `GET /transaction-account/{id}`

**Parameters:**

- `id` (path): Transaction account ID (16 characters)

**Example Request:**

```http
GET /transaction-account/tx_acc_001234567
Authorization: Bearer <token>
```

**Example Response:**

```json
{
  "id": "tx_acc_001234567",
  "prophetId": "dev_prophet_001",
  "accountName": "Main Business Account",
  "accountNumber": "1234567890",
  "bank": "KBANK",
  "isDefault": true
}
```

### 3. Create Transaction Account

Creates a new payment account for a prophet.

**Endpoint:** `POST /transaction-account`

**Request Body:**

```json
{
  "prophetId": "dev_prophet_001",
  "accountName": "New Business Account",
  "accountNumber": "9876543210",
  "bank": "SCB"
}
```

**Example Response:**

```json
{
  "id": "tx_acc_new123456",
  "prophetId": "dev_prophet_001",
  "accountName": "New Business Account",
  "accountNumber": "9876543210",
  "bank": "SCB",
  "isDefault": false
}
```

### 4. Update Transaction Account

Updates details of an existing transaction account.

**Endpoint:** `PATCH /transaction-account/{id}`

**Parameters:**

- `id` (path): Transaction account ID to update

**Request Body (all fields optional):**

```json
{
  "accountName": "Updated Account Name",
  "accountNumber": "5555555555",
  "bank": "BBL"
}
```

**Example Response:**

```json
{
  "id": "tx_acc_001234567",
  "prophetId": "dev_prophet_001",
  "accountName": "Updated Account Name",
  "accountNumber": "5555555555",
  "bank": "BBL",
  "isDefault": true
}
```

### 5. Set Default Transaction Account

Sets a specific transaction account as the default payment method for a prophet.

**Endpoint:** `PATCH /transaction-account/prophet/{prophetId}/default/{transactionId}`

**Parameters:**

- `prophetId` (path): Prophet's ID
- `transactionId` (path): Transaction account ID to set as default

**Example Request:**

```http
PATCH /transaction-account/prophet/dev_prophet_001/default/tx_acc_001234567
Authorization: Bearer <token>
```

**Example Response:**

```json
{
  "id": "tx_acc_001234567",
  "prophetId": "dev_prophet_001",
  "accountName": "Prophet Banking Account",
  "accountNumber": "1234567890",
  "bank": "KBANK",
  "isDefault": true
}
```

### 6. Delete Transaction Account

Permanently deletes a transaction account.

**Endpoint:** `DELETE /transaction-account/{id}`

**Parameters:**

- `id` (path): Transaction account ID to delete

**Example Request:**

```http
DELETE /transaction-account/tx_acc_001234567
Authorization: Bearer <token>
```

**Example Response:**

```json
{
  "id": "tx_acc_001234567",
  "prophetId": "dev_prophet_001",
  "accountName": "Deleted Account",
  "accountNumber": "1234567890",
  "bank": "KBANK",
  "isDefault": false
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": [
    "prophetId length should be 16",
    "accountName length should be max 45 characters"
  ],
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Transaction account not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Transaction account with this account number and bank already exists",
  "error": "Conflict"
}
```

## Data Models

### TransactionAccountDto

```typescript
{
  id: string // 16 characters, unique identifier
  prophetId: string // 16 characters, prophet's ID
  accountName: string // 1-45 characters, display name
  accountNumber: string // 1-20 characters, bank account number
  bank: Bank // Bank enum value
  isDefault: boolean // Whether this is the default account
}
```

### CreateTransactionAccountDto

```typescript
{
  prophetId: string // Required, 16 characters
  accountName: string // Required, 1-45 characters
  accountNumber: string // Required, 1-20 characters
  bank: Bank // Required, valid bank enum
}
```

### UpdateTransactionAccountDto

```typescript
{
  accountName?: string;  // Optional, 1-45 characters
  accountNumber?: string; // Optional, 1-20 characters
  bank?: Bank;           // Optional, valid bank enum
}
```

## Business Rules

1. **Prophet Ownership**: Transaction accounts belong to specific prophets and cannot be transferred.

2. **Default Account**: Only one account per prophet can be marked as default.

3. **Bank Uniqueness**: Each prophet can have only one account per bank with the same account number.

4. **Account Validation**: Account numbers must be valid for the specified bank.

5. **Deletion Rules**: Deleting a default account requires setting another account as default first.

## Rate Limiting

API requests are subject to rate limiting:

- 100 requests per minute per user
- 1000 requests per hour per user

## Contact

For API support, contact: dev@doo-doung.com
