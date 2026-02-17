# Invoice Engine - Postman Testing Guide

This guide details how to verify the Invoice Financing System API using Postman or cURL.

## Prerequisites
1. **Server Running**: Ensure backend is running (`npm start` or `npm run dev`).
2. **Database Ready**: Ensure database migrations are applied (`npx prisma migrate dev`) and client is generated (`npx prisma generate`).
3. **Authentication**: Use `d:\Project Morpheus\server\middleware\authMiddleware.js` (Simulated flow).
   - Obtain a valid JWT token for an **MSME User**.
   - Set Header: `Authorization: Bearer <your_jwt_token>`

---

## 1. Create Invoice (Success Scenario)

**Endpoint**: `POST /invoices/create`
**Role**: MSME User
**Description**: Creates a valid invoice that passes fraud checks (Low Risk).

```json
// Request Body
{
  "amount": 50000,
  "dueDate": "2026-12-31",
  "buyerGSTIN": "22AAAAA0000A1Z5"
}
```

**Expected Response (201 Created)**:
```json
{
  "message": "Invoice processed",
  "invoice": {
    "id": "uuid-here",
    "amount": "50000",
    "status": "VERIFIED",
    "created_at": "2026-02-17T...",
    ...
  },
  "fraudAnalysis": {
    "isFlagged": false,
    "riskScore": 0,
    "reasons": "Low Risk"
  },
  "creditAnalysis": {
    "score": 100,
    "level": "LOW"
  }
}
```

---

## 2. Create Invoice (Fraud Flagged)

**Endpoint**: `POST /invoices/create`
**Role**: MSME User (New Business / High Risk Profile)
**Description**: Triggers fraud logic (e.g., Amount > 300k for new business).

```json
// Request Body
{
  "amount": 350000,
  "dueDate": "2026-12-31",
  "buyerGSTIN": "22BBBBB1111B1Z5"
}
```

*Note*: Ensure test user has `business_age < 6` months in DB to trigger this specific rule.

**Expected Response (201 Created - Flagged)**:
```json
{
  "message": "Invoice processed",
  "invoice": {
    "id": "uuid-here",
    "amount": "350000",
    "status": "PENDING", // Held for review
    ...
  },
  "fraudAnalysis": {
    "isFlagged": true,
    "riskScore": 50,
    "reasons": "High Value Invoice for New Business"
  },
  "creditAnalysis": {
    "score": 70, // Deducted due to risk
    "level": "MEDIUM"
  }
}
```

---

## 3. Validation Error (Bad Request)

**Endpoint**: `POST /invoices/create`
**Description**: Tests Zod validation for invalid inputs.

```json
// Request Body (Invalid Amount & Date)
{
  "amount": -100,
  "dueDate": "2020-01-01",
  "buyerGSTIN": "INVALID-GSTIN"
}
```

**Expected Response (400 Bad Request)**:
```json
{
  "error": "Validation Error",
  "details": [
    "Amount must be greater than 0",
    "Due date must be in the future",
    "Invalid GSTIN format"
  ]
}
```

---

## 4. Unauthorized Access (Authentication Failed)

**Endpoint**: `POST /invoices/create`
**Description**: Request without proper token.

**Headers**: (Missing or Invalid `Authorization`)

**Expected Response (401 Unauthorized)**:
```json
{
  "message": "Not authorized, no token"
}
```

---

## 5. Fetch My Invoices

**Endpoint**: `GET /invoices/my`
**Role**: MSME User
**Description**: Retrieves list of invoices for logged-in user.

**Expected Response (200 OK)**:
```json
[
  {
    "id": "uuid-1",
    "amount": "50000",
    "status": "VERIFIED",
    "credit_score": { "score": 100, "risk_level": "LOW" },
    "fraud_flags": []
  },
  {
    "id": "uuid-2",
    "amount": "350000",
    "status": "PENDING",
    "fraud_flags": [
      { "reason": "High Value Invoice for New Business", "riskScore": 50 }
    ]
  }
]
```
