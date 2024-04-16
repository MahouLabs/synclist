import {
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
  vitePlugin as remix,
} from "@remix-run/dev";
import { remixDevTools } from "remix-development-tools";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remixCloudflareDevProxy(), remixDevTools(), remix(), tsconfigPaths()],
});
