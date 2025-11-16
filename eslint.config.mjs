import nextConfig from "eslint-config-next";
import typescriptConfig from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextConfig,
  ...typescriptConfig,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "test-deploy/**",
    ],
  },
];

export default eslintConfig;
