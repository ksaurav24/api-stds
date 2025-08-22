import * as fs from "fs";
import * as path from "path";

export type StdApiConfig = {
  response: {
    includeMeta: boolean;
    metaFields: string[];
    timestampFormat: "iso" | "unix";
    defaultApiVersion: string;
  };
  errors: {
    defaultCode: string;
    defaultMessage: string;
    registryPath: string;
  };
  asyncHandler: {
    logUnhandledErrors: boolean;
    mapUnknownToInternal: boolean;
  };
  logging: {
    enabled: boolean;
    level: "debug" | "info" | "warn" | "error";
    format: "json" | "text";
  };
  requestId: {
    enabled: boolean;
    headerName: string;
  };
};

const defaultConfig: StdApiConfig = {
  response: { includeMeta: true, metaFields: ["timestamp", "requestId"], timestampFormat: "iso", defaultApiVersion: "v1" },
  errors: { defaultCode: "INTERNAL_ERROR", defaultMessage: "Something went wrong", registryPath: "" },
  asyncHandler: { logUnhandledErrors: true, mapUnknownToInternal: true },
  logging: { enabled: false, level: "info", format: "json" },
  requestId: { enabled: true, headerName: "x-request-id" }
};

let cachedConfig: StdApiConfig = defaultConfig;

export function getConfig(): StdApiConfig {
  if (cachedConfig) return cachedConfig;
  const filePath = path.resolve(process.cwd(), "std-api.config.json");
  if (fs.existsSync(filePath)) {
    const userConfig = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    cachedConfig = { ...defaultConfig, ...userConfig };
  }
  return cachedConfig;
}
