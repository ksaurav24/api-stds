 
# api-stds

A lightweight utility library for **standardized API responses**, **async error handling**, and **configuration-driven response formatting** in Express.js applications.

---

## Features

- ✅ Standardized JSON response format (`successResponse`, `errorResponse`)  
- ✅ `asyncHandler` wrapper for safe async/await route handling  
- ✅ `ApiError` class for consistent error throwing  
- ✅ Middleware (`standardize`) to attach `res.success` and `res.error` methods  
- ✅ Config-driven response metadata (timestamps, API version, etc.)  
- ✅ Error registry support for consistent error codes/messages  

---

## Quick Start

```bash
npx api-stds init
````

This will set up the package in your project.

---

## Usage

### 1. Middleware Setup

```ts
import express from "express";
import { standardize } from "api-stds";

const app = express();

// Apply standardize middleware
app.use(standardize());
```

This middleware extends the `res` object with:

```ts
res.success(data, meta?);
res.error(code, message?, details?, meta?);
```

---

### 2. Success Response

```ts
app.get("/ping", (req, res) => {
  return res.success({ pong: true });
});
```

**Response:**

```json
{
  "success": true,
  "data": { "pong": true },
  "error": null,
  "meta": {
    "timestamp": 1734913293044,
    "apiVersion": "v1"
  }
}
```

---

### 3. Error Response

```ts
app.get("/error", (req, res) => {
  return res.error("NOT_FOUND", "Resource not found", { resource: "User" });
});
```

**Response:**

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": { "resource": "User" }
  },
  "meta": {
    "timestamp": 1734913293044,
    "apiVersion": "v1"
  }
}
```

---

### 4. Async Handler

```ts
import { asyncHandler, ApiError } from "api-stds";

app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError("NOT_FOUND", "User not found");
    return res.success(user);
  })
);
```

---

### 5. ApiError Class

```ts
import { ApiError } from "api-stds";

throw new ApiError("BAD_REQUEST", "Invalid input", [
  { field: "email", message: "Email is required" },
]);
```

---

### 6. Config

```ts
app.use(
  standardize({
    response: {
      includeMeta: true,
      timestampFormat: "iso", // "unix" | "iso"
      defaultApiVersion: "v2",
      metaFields: ["timestamp", "apiVersion"],
    },
  })
);
```

---

### 7. Error Registry

```ts
import { loadErrorRegistry, getError } from "api-stds";

loadErrorRegistry({
  NOT_FOUND: "The resource was not found",
  UNAUTHORIZED: "Unauthorized access",
});

res.error("NOT_FOUND", getError("NOT_FOUND"));
```

---

## Response Format

```json
{
  "success": boolean,
  "data": object | null,
  "error": {
    "code": string,
    "message": string,
    "details": any
  } | null,
  "meta": {
    "timestamp"?: number | string,
    "apiVersion"?: string
  }
} 
 