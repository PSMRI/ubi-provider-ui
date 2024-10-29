import { defineConfig } from "vite";
import "dotenv/config";

/*
export default defineConfig({
  server: {
    proxy: {
      // List of APIs to be proxied to the `VITE_APP_PROXY_URL`
      "/egov-mdms-service": {
        target: process.env.VITE_APP_PROXY_URL,
        changeOrigin: true,
        secure: false,
      },
      "/egov-location": {
        target: process.env.VITE_APP_PROXY_URL,
        changeOrigin: true,
        secure: false,
      },
      // Add all other routes you want to proxy similarly
      "/localization": {
        target: process.env.VITE_APP_PROXY_URL,
        changeOrigin: true,
        secure: false,
      },
      // Proxy specific to `VITE_APP_PROXY_ASSETS` or default
      "/pb-egov-assets": {
        target: process.env.VITE_APP_PROXY_ASSETS,
        changeOrigin: true,
        secure: false,
      },
      // Additional route for application API status
      "/application/v1/_appstat": {
        target: process.env.VITE_APP_PROXY_URL,
        changeOrigin: true,
        secure: false,
      },
      // Continue adding routes as necessary
    },
  },
});
*/
console.log(
  "process.env.VITE_APP_PROXY_API, : " + process.env.VITE_APP_PROXY_API
);

export default defineConfig({
  server: {
    proxy: {
      "/application": {
        target: process.env.VITE_APP_PROXY_API, // or your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
