import fs from "fs";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import ts from "@wessberg/rollup-plugin-ts";
import builtins from "builtins";
// import shebang from "rollup-plugin-add-shebang";
import { terser } from "rollup-plugin-terser";
import optionalRequire from "./src/rollup-plugin-optional-require";

const packageJson = JSON.parse(fs.readFileSync("package.json"));
const peerDependencies = Object.keys(packageJson.peerDependencies || {});
const external = builtins().concat(peerDependencies);

function createConfiguration(_options, mode) {
  const suffix = mode === "production" ? ".min" : "";

  const output = [
    {
      format: "cjs",
      dir: "dist",
      entryFileNames: `[name]${suffix}.js`,
      chunkFileNames: `[name]-[hash]${suffix}.js`,
    },
    {
      format: "es",
      dir: "dist",
      entryFileNames: `[name]${suffix}.mjs`,
      chunkFileNames: `[name]-[hash]${suffix}.mjs`,
    },
  ];

  const plugins = [
    optionalRequire(),
    replace({
      preventAssignment: true,
      "process.env.npm_package_name": JSON.stringify(
        process.env.npm_package_name
      ),
      "process.env.npm_package_version": JSON.stringify(
        process.env.npm_package_version
      ),
    }),
    resolve(),
    commonjs(),
    json(),
    ts(),
  ];

  if (mode) {
    plugins.push(
      replace({
        "process.env.NODE_ENV": JSON.stringify(mode),
      })
    );
  }

  if (mode === "production") {
    plugins.push(
      terser({
        mangle: { toplevel: true },
      })
    );
  }

  // for (const o of output) {
  //   plugins.push(
  //     shebang({
  //       include: [o.file],
  //     })
  //   );
  // }

  return { output, external, plugins };
}

export default function (options) {
  return [
    createConfiguration(options),
    createConfiguration(options, "production"),
  ];
}
