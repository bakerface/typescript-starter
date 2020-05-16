module.exports = {
  checkCoverage: true,
  sourceMap: true,
  branches: 100,
  functions: 100,
  lines: 100,
  statements: 100,
  include: ["**/*.ts", "**/*.tsx"],
  exclude: ["**/*.test.*"],
  extension: [".ts", ".tsx"],
  reporter: ["text", "json-summary"],
  require: ["ts-node/register"],
};
