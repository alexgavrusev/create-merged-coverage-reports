import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts", "./src/bin.ts"],
  platform: "node",
  exports: true,
  dts: true,
  sourcemap: true,
});
