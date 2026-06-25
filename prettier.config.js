/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-svelte"],
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  printWidth: 100,
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};
