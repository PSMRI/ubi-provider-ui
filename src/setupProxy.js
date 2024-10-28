const { createProxyMiddleware } = require("http-proxy-middleware");
const createProxy = createProxyMiddleware({
  target: import.meta.env.VITE_APP_PROXY_URL,
  changeOrigin: true,
});
const assetsProxy = createProxyMiddleware({
  target:
    import.meta.env.VITE_APP_PROXY_ASSETS || "https://works-dev.digit.org",
  changeOrigin: true,
  secure: false,
});
module.exports = function (app) {
  [
    "/egov-mdms-service",
    "/egov-location",
    "/localization",
    "/egov-workflow-v2",
    "/pgr-services",
    "/filestore",
    "/egov-hrms",
    "/user-otp",
    "/user",
    "/fsm",
    "/billing-service",
    "/collection-services",
    "/pdf-service",
    "/pg-service",
    "/vehicle",
    "/vendor",
    "/property-services",
    "/fsm-calculator/v1/billingSlab/_search",
    "/muster-roll",
    "/uba-bff-service",
    "/application/v1/_appstat",
  ].forEach((location) => app.use(location, createProxy));
  ["/pb-egov-assets"].forEach((location) => app.use(location, assetsProxy));
};
