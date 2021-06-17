const liveServer = require('live-server');
const config = require('./../generate/config.js');
const serveConfig = config.configJson.serve || {};
const generate = require('../generate/');

generate();

liveServer.start({
	port: 8000,
	open: true,
	logLevel: 2,
	root: config.dest,
	watch: config.target,
	...serveConfig,
});

liveServer.watcher.on('change', () => generate());
