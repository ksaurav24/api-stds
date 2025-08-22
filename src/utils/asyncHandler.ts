import { getConfig } from "../config/config";
import {Request, Response, NextFunction} from "express";
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  const config = getConfig();
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (config.asyncHandler.logUnhandledErrors) {
        console.error("Unhandled error in asyncHandler:", err);
      }
      if (typeof res.error === "function") {
        return res.error(err.code || config.errors.defaultCode, err.message || config.errors.defaultMessage, err.details || {});
      }
      next(err);
    });
  };
}
