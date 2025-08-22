import * as crypto from "crypto";

export function generateRequestId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
}
