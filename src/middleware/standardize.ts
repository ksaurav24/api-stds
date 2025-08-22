import { successResponse, errorResponse } from "../core/responses";
import { generateRequestId } from "../core/requestId";
import { getConfig } from "../config/config";

export function standardize(customConfig?: any) {
  const config = { ...getConfig(), ...customConfig };

  return (req, res, next) => {
    if (config.requestId.enabled) {
      res.locals.requestId = req.headers[config.requestId.headerName] || generateRequestId();
    }

    res.success = (data: any, meta?: any) => successResponse(res, data, meta);
    res.error = (code: string, message?: string, details: any = {}, meta?: any) => {
      return errorResponse(res, code, message || config.errors.defaultMessage, details, meta);
    };

    next();
  };
}
