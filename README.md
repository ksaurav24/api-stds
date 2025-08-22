# api-stds

A lightweight toolkit for standardizing API responses and improving developer experience in Node.js applications.  
Includes async handler, configurable response formats, error normalization, request ID injection, and more, all customizable with `api-stds.config.json`.

## Features

- ⚡ Async handler, no more try/catch boilerplate.  
- 📦 Standardized responses, consistent success/error payloads.  
- 🛠 Config-driven, customize behavior via `api-stds.config.json`.  
- 🆔 Request ID support, opt-in correlation IDs for debugging.  
- 📜 Error normalization, unify error shapes.  
- 🔧 CLI, quick project setup via `npx api-stds init`.  

---

## Installation

```bash
npm i api-stds
````

---

## Initialization

Run once per project:

```bash
npx api-stds init
```

This will:

* Create a `api-stds.config.json`
* Prompt you for features (e.g. enable `requestId`)
* Install `api-stds` if not already installed

---

## Example Usage

### Express Example

```ts
import express from "express";
import { asyncHandler, stdResponse } from "api-stds";

const app = express();

app.get(
  "/user",
  asyncHandler(async (req, res) => {
    const user = { id: 1, name: "Captain" };
    res.json(stdResponse.success(user));
  })
);

app.get(
  "/error",
  asyncHandler(async () => {
    throw new Error("Something went wrong!");
  })
);

app.listen(3000, () => console.log("Server running on port 3000"));
```

### Example Success Response

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Captain"
  },
  "requestId": "3f2d8a17-9d34-4c8c-8f2b-9a123c4c5a90"
}
```

### Example Error Response

```json
{
  "status": "error",
  "message": "Something went wrong!",
  "code": "INTERNAL_SERVER_ERROR",
  "requestId": "3f2d8a17-9d34-4c8c-8f2b-9a123c4c5a90"
}
```

---

## Configuration

`api-stds.config.json` (auto-generated with `npx api-stds init`):

```json
{
  "useRequestId": true,
  "responseFormat": {
    "successKey": "data",
    "errorKey": "message",
    "includeTimestamp": true
  }
}
```

---

## Scripts

```bash
npm run build     # compile TypeScript → dist
npm run test      # run unit tests
npm run lint      # lint with ESLint
npm run format    # format with Prettier
```
---