const { createProxyMiddleware } = require('http-proxy-middleware');

console.log('setupProxy.js 파일 로드 시작!');

module.exports = function(app) {
  console.log('setupProxy.js 실행됨!');
  
  app.use(
    '/sign',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
      pathRewrite: {
        '^/sign/': ''
      }
    })
  );

  app.use(
    '/course',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: false,
    })
  );

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: false,
    })
  );
};