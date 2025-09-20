// @ts-check

import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import typescript from "typescript-eslint";

export default defineConfig([
    {
        ignores: ["node_modules/", "dist/"],
    },
    js.configs.recommended,
    ...typescript.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
]);
