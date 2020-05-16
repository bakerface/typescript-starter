import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import ts from "@wessberg/rollup-plugin-ts";
import builtins from "builtins";
import { terser } from "rollup-plugin-terser";

function createConfiguration(mode) {
  const name = process.env.npm_package_name || "";
  const version = process.env.npm_package_version || "";
  const suffix = mode === "production" ? ".min" : "";

  const output = [
    { format: "cjs", file: `dist/${name}${suffix}.js` },
    { format: "es", file: `dist/${name}${suffix}.mjs` },
  ];

  const plugins = [
    replace({
      "process.env.npm_package_name": JSON.stringify(name),
      "process.env.npm_package_version": JSON.stringify(version),
    }),
    resolve(),
    commonjs(),
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

export default [createConfiguration(), createConfiguration("production")];
