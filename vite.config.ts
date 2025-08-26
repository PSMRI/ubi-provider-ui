import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "use client" warnings from Chakra UI
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },
  /*
server: {
  proxy: {
    "/application": {
      target: process.env.VITE_APP_PROXY_API,
      changeOrigin: true,
      secure: false,
    },
    "/benefits": {
      target: process.env.VITE_APP_PROXY_API,
      changeOrigin: true,
      secure: false,
    },
  },
},
*/
});
