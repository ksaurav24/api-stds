#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import * as readline from "readline";

const configFile = path.resolve(process.cwd(), "api-stds.config.json");

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
    console.log("api-stds.config.json already exists");
    return;
  }

  const config = {
    ...defaultConfig,
  };

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  console.log("🎉 Created api-stds.config.json");

  // Auto install api-stds
  try {
    console.log("Installing api-stds...");
    execSync("npm install api-stds", { stdio: "inherit" });
    console.log("api-stds installed successfully");
  } catch (err) {
    console.error("Failed to install api-stds. Please run `npm install api-stds` manually.");
  }
}

function showHelp() {
  console.log(`
Usage:
  api-stds init     Create api-stds.config.json interactively and install api-stds
  api-stds help     Show this help message
`);
}

const args = process.argv.slice(2);

if (args[0] === "init") {
  initConfig();
} else {
  showHelp();
}
