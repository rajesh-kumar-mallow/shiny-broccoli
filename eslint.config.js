import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["src/vite-env.d.ts"],
    rules: {
      // moment/$/jQuery are host-page globals with no real type surface to declare.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["src/*.{js,tsx}"],
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
  {
    files: ["src/SmartAttendanceAssistant.tsx"],
    languageOptions: {
      globals: {
        moment: "readonly",
        $: "readonly",
        jQuery: "readonly",
      },
    },
  },
);
