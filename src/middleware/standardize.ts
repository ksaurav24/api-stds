import { successResponse, errorResponse } from "../core/responses.js";
import { getConfig } from "../config/config.js";
import { Request, Response, NextFunction } from "express";

export function standardize(customConfig?: any) {
  const config = { ...getConfig(), ...customConfig };

  return (req: Request, res: Response, next: NextFunction) => {
    res.success = (data: any, meta?: any) =>
      successResponse(res, data, meta);

    res.error = (
      code: string,
      message?: string,
      details: any = {},
      meta?: any
    ) => {
      return errorResponse(
        res,
        code,
        message || config.errors.defaultMessage,
        details,
        meta
      );
    };

    next();
  };
}
