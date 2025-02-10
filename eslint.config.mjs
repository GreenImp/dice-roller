// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      // disable eslint rule so it doesn't conflict
      "class-methods-use-this": "off",
      "@typescript-eslint/class-methods-use-this": "error",
      "@typescript-eslint/no-inferrable-types": "off"
    }
  }
);
