/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorResponse } from "../core/responses.js";

export const asyncHandler =
  (fn: (req: any, res: any, next: any) => Promise<void>) =>
  (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      const statusCode = error?.statusCode || 500;
      const message = error?.message || "Internal Server Error";
      const errors = error?.erasyncHandlerrors || ["An unexpected error occurred"];
      const requestId = res.locals?.requestId;

      const apiError = errorResponse(
        message,
        statusCode,
        errors,
        requestId
      );

      res.status(statusCode).json(apiError);
    });
  };


