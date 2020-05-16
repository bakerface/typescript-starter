module.exports = {
  extends: [
    "prettier",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  plugins: [
    "import",
    "prettier",
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["dist/*.js", "dist/*.mjs", "dist/*.d.ts"],
  rules: {
    indent: [0],
    "prettier/prettier": [1],
    "import/order": [
      1,
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: false,
        },
      },
    ],
    "@typescript-eslint/no-var-requires": [0],
    "@typescript-eslint/indent": [0],
    "@typescript-eslint/no-unused-vars": [
      2,
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": [0],
      },
    },
  ],
};
