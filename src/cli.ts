#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import * as readline from "readline";

const configFile = path.resolve(process.cwd(), "std-api.config.json");

const defaultConfig = {
  response: {
    includeMeta: true,
    metaFields: ["timestamp", "requestId", "apiVersion"],
    timestampFormat: "iso",
    defaultApiVersion: "v1"
  },
  errors: {
    defaultCode: "INTERNAL_ERROR",
    defaultMessage: "Something went wrong",
    registryPath: "./errors.json"
  },
  asyncHandler: {
    logUnhandledErrors: true,
    mapUnknownToInternal: true
  },
  logging: {
    enabled: true,
    level: "info",
    format: "json"
  },
  requestId: {
    enabled: true,
    headerName: "x-request-id"
  }
};

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function initConfig() {
  if (fs.existsSync(configFile)) {
    console.log("std-api.config.json already exists");
    return;
  }

  // Ask customization
  const requestIdAnswer = await askQuestion("Enable requestId generation? (y/n): ");
  const includeRequestId = requestIdAnswer.toLowerCase().startsWith("y");

  const config = {
    ...defaultConfig,
    requestId: {
      ...defaultConfig.requestId,
      enabled: includeRequestId
    }
  };

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  console.log("🎉 Created std-api.config.json");

  // Auto install std-api
  try {
    console.log("Installing std-api...");
    execSync("npm install std-api", { stdio: "inherit" });
    console.log("std-api installed successfully");
  } catch (err) {
    console.error("Failed to install std-api. Please run `npm install std-api` manually.");
  }
}

function showHelp() {
  console.log(`
Usage:
  std-api init     Create std-api.config.json interactively and install std-api
  std-api help     Show this help message
`);
}

const args = process.argv.slice(2);

if (args[0] === "init") {
  initConfig();
} else {
  showHelp();
}
