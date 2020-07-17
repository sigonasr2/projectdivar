const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	var endpoints = [
	"/song/:songname",
	"/register",
	"/remove",
	"/submit",
	"/songdiffs",
	"/accuracy/:username",
	"/recalculatescore/:playid",
	"/bestplay/:username/:songname/:difficulty",
	"/userdata/:username",
	"/playcount/:username/:songname/:difficulty",
	"/songpasscount/:username/:songname/:difficulty",
	"/songfccount/:username/:songname/:difficulty",
	"/rating/:username",
	"/users/:orderby/:sortorder",
	]
  app.use(
	"/song/:songname",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/register",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/remove",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/submit",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/songdiffs",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/accuracy/:username",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/recalculatescore/:playid",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/bestplay/:username/:songname/:difficulty",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/userdata/:username",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/playcount/:username/:songname/:difficulty",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/songpasscount/:username/:songname/:difficulty",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/songfccount/:username/:songname/:difficulty",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/rating/:username",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/users/:orderby/:sortorder",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/twitter/mentions",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
};