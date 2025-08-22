import * as fs from "fs";
import * as path from "path";
import { getConfig } from "../config/config";

let registry: Record<string, { httpStatus: number; message: string }> = {};

export function loadErrorRegistry() {
  const config = getConfig();
  if (config.errors.registryPath && fs.existsSync(config.errors.registryPath)) {
    registry = JSON.parse(fs.readFileSync(path.resolve(config.errors.registryPath), "utf-8"));
  }
}

export function getError(code: string) {
  return registry[code] || { httpStatus: 400, message: code };
}
