import { getConfig } from "../config/config.js";
import type { Response } from "express";

export function successResponse(res: Response, data: any, meta: any = {}) {
  const config = getConfig();
  const metaObj: any = {};

  if (config.response.includeMeta) {
    if (config.response.metaFields.includes("timestamp")) {
      metaObj.timestamp =
        config.response.timestampFormat === "unix"
          ? Date.now()
          : new Date().toISOString();
    }

    if (config.response.metaFields.includes("apiVersion")) {
      metaObj.apiVersion = config.response.defaultApiVersion;
    }
  }

  return res.json({
    success: true,
    data,
    error: null,
    meta: { ...metaObj, ...meta },
  });
}

export function errorResponse(res: Response, code: string, message: string, details: any = {}, meta: any = {}) {
  const config = getConfig();
  const metaObj: any = {};

  if (config.response.includeMeta) {
    if (config.response.metaFields.includes("timestamp")) {
      metaObj.timestamp =
        config.response.timestampFormat === "unix"
          ? Date.now()
          : new Date().toISOString();
    }

    if (config.response.metaFields.includes("apiVersion")) {
      metaObj.apiVersion = config.response.defaultApiVersion;
    }
  }

  return res.status(400).json({
    success: false,
    data: null,
    error: { code, message, details },
    meta: { ...metaObj, ...meta },
  });
}
