import { getConfig } from "../config/config";

export function asyncHandler(fn: Function) {
  const config = getConfig();
  return (req, res, next) => {
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
