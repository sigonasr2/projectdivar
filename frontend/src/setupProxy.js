const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
	"/eventchart",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/eventsubmit",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/eventdata",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/eventdata/t20",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/recalculatePlayerData/:id",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/streamtop/:id",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/streamkill/:id",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/streamstart/:id",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/streaminfo/:id",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/updates/:userid",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/passImageData",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/getUserAuthData",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/streamdata/:id",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/updateuser",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/findsong/:songname",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/authenticate/authToken",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/updateRegisteredState",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/authenticate/login",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/authenticateuser",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/sendemail/register",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/sendemail/login",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/recentplays/:username",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/plays/:username/:songname",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/song/:songname/:difficulty",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/ratings/:songname",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/completionreport/:username",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
	);
	app.use(
	"/songmods/:username/:songname/:difficulty",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
	app.use(
	"/songpfccount/:username/:songname/:difficulty",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
	app.use(
	"/songs",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
	app.use(
	"/bestplays/:username",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/image",
	createProxyMiddleware({
	  target: 'http://projectdivar.com:4503',
	  changeOrigin: true,
	})
  );
  app.use(
	"/upload",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
  app.use(
	"/song/:songname",
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
  app.use(
	"/files",
	createProxyMiddleware({
	  target: 'http://server:4501',
	  changeOrigin: true,
	})
  );
};