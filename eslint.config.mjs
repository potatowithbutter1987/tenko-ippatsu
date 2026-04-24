import js from "@eslint/js";
import next from "eslint-config-next";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "eslint.config.mjs"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
  {
    plugins: {
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "prefer-const": "error",
      "no-var": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./*", "../*"],
              message: "相対パスは禁止です。@/ エイリアスを使用してください。",
            },
          ],
        },
      ],
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc" },
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          "newlines-between": "always",
          pathGroups: [
            {
              group: "internal",
              pattern: "@/**",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "import/no-duplicates": "error",
      complexity: ["error", { max: 10 }],
      "max-depth": ["error", { max: 3 }],
      "no-nested-ternary": "error",
    },
  },
  prettier,
);
