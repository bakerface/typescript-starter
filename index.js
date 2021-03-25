#!/usr/bin/env node

const cp = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const util = require("util");
const { version } = require("./package.json");

const existsAsync = util.promisify(fs.exists);
const mkdirAsync = util.promisify(fs.mkdir);
const readdirAsync = util.promisify(fs.readdir);
const statAsync = util.promisify(fs.stat);
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

function spawn(command, ...args) {
  return new Promise((resolve, reject) => {
    const proc = cp.spawn(command, args, {
      shell: true,
      env: process.env,
      stdio: "inherit",
    });

    proc.on("close", (code) => {
      if (code === 0) {
        return resolve();
      }

      return reject(
        new Error(
          `The command "${command} ${args.join(" ")}" exited with code ${code}`
        )
      );
    });
  });
}

async function createFileFromTemplate(vars, source, destination) {
  const buffer = await readFileAsync(source);
  const template = "" + buffer;

  const contents = template
    .replace(/{{name}}/g, vars.name)
    .replace(/{{version}}/g, vars.version);

  await writeFileAsync(destination, contents);
}

async function createTemplateRecursive(vars, source, destination) {
  await mkdirAsync(destination, { recursive: true });

  const entries = await readdirAsync(source);

  for (const entry of entries) {
    const from = path.join(source, entry);
    const to = path.join(destination, entry);

    const stat = await statAsync(from);

    if (stat.isDirectory()) {
      await createTemplateRecursive(vars, from, to);
    } else {
      await createFileFromTemplate(vars, from, to);
    }
  }
}

async function createProject(name) {
  const exists = await existsAsync(name);

  if (exists) {
    throw new Error(`Refusing to overwrite existing directory "${name}"`);
  }

  const vars = {
    name,
    version,
  };

  await createTemplateRecursive(vars, path.join(__dirname, "template"), name);

  const ignored = [".nyc_output", "coverage", "dist", "node_modules"];
  const gitignore = ignored.join(os.EOL);

  await writeFileAsync(path.join(name, ".gitignore"), gitignore);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (command === "create") {
    return createProject(...args);
  }

  if (command === "build") {
    const config = path.join(__dirname, "rollup.config.js");
    return spawn("rollup", "--config", config, "-i", ...args);
  }

  if (command === "dev") {
    return spawn("ts-node-dev", "--respawn", ...args);
  }

  if (command === "lint") {
    return spawn("eslint", "--ext", "js,jsx,ts,tsx", ...args);
  }

  if (command === "test") {
    return spawn("nyc", "mocha", ...args);
  }

  throw new Error(`Unrecognized command "${command}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
