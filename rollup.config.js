import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import ts from "@wessberg/rollup-plugin-ts";
import builtins from "builtins";
import { terser } from "rollup-plugin-terser";

function basename(file = "") {
  return path.basename(file).split(".").shift();
}

function createConfiguration(options, mode) {
  const name = basename(options.i, ".ts");
  const suffix = mode === "production" ? ".min" : "";

  const output = [
    { format: "cjs", file: `dist/${name}${suffix}.js` },
    { format: "es", file: `dist/${name}${suffix}.mjs` },
  ];

  const plugins = [
    replace({
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

  return {
    output,
    external: builtins(),
    plugins,
  };
}

export default function (options) {
  return [
    createConfiguration(options),
    createConfiguration(options, "production"),
  ];
}
