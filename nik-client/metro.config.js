const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { createProxyMiddleware } = require('http-proxy-middleware');

const config = getDefaultConfig(__dirname);

const API_TARGET = process.env.NIK_API_PROXY_TARGET || 'http://127.0.0.1:8888';

const apiProxy = createProxyMiddleware({
  target: API_TARGET,
  changeOrigin: true,
  logLevel: 'warn',
});

config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware) => {
    return (req, res, next) => {
      const url = req.url || '';
      if (url.startsWith('/api') || url.startsWith('/uploads')) {
        return apiProxy(req, res, next);
      }
      return metroMiddleware(req, res, next);
    };
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
