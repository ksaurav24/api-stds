/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorResponse } from "../core/responses.js";
import { ApiError } from "./ApiError.js";

export const asyncHandler =
  (fn: (req: any, res: any, next: any) => Promise<void>) =>
  (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      if (error instanceof ApiError) {
        // If it's a custom ApiError, respect its shape
        return errorResponse(
          res,
          error.statusCode,      // string
          error.message,         // message
          error.errors,          // details
          { requestId: res.locals?.requestId } // meta
        );
      }

      // Fallback for unexpected errors
      return errorResponse(
        res,
        "INTERNAL_ERROR",
        error?.message || "Internal Server Error",
        error?.details || ["An unexpected error occurred"],
        { requestId: res.locals?.requestId }
      );
    });
  };
