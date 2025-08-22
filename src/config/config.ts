import * as fs from "fs";
import * as path from "path";

const defaultConfig = {
  response: {
    includeMeta: true,
    metaFields: ["timestamp", "requestId"],
    timestampFormat: "iso",
    defaultApiVersion: "v1",
  },
  errors: {
    defaultCode: "INTERNAL_ERROR",
    defaultMessage: "Something went wrong",
    registryPath: "",
  },
  asyncHandler: {
    logUnhandledErrors: true,
    mapUnknownToInternal: true,
  },
  logging: {
    enabled: false,
    level: "info",
    format: "json",
  }
};

let cachedConfig: any = null;

export function getConfig() {
  if (cachedConfig) return cachedConfig;

  const filePath = path.resolve(process.cwd(), "api-stds.config.json");

  if (fs.existsSync(filePath)) {
    const userConfig = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    cachedConfig = {
      ...defaultConfig,
      ...userConfig,
      response: { ...defaultConfig.response, ...(userConfig.response || {}) },
      errors: { ...defaultConfig.errors, ...(userConfig.errors || {}) },
      asyncHandler: {
        ...defaultConfig.asyncHandler,
        ...(userConfig.asyncHandler || {}),
      },
      logging: { ...defaultConfig.logging, ...(userConfig.logging || {}) },
    };
  } else {
    cachedConfig = defaultConfig;
  }

  return cachedConfig;
}
