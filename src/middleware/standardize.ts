import { successResponse, errorResponse } from "../core/responses";
import { generateRequestId } from "../core/requestId";
import { getConfig } from "../config/config";
import { Request,Response,NextFunction } from "express";
export function standardize(customConfig?: any) {
  const config = { ...getConfig(), ...customConfig };

  return (req: Request, res: Response, next: NextFunction) => {
    if (config.requestId.enabled) {
      res.locals.requestId = req.header(config.requestId.headerName) || generateRequestId();
    }

    res.success = (data: any, meta?: any) => successResponse(res, data, meta);
    res.error = (code: string, message?: string, details: any = {}, meta?: any) => {
      return errorResponse(res, code, message || config.errors.defaultMessage, details, meta);
    };

    next();
  };
}
