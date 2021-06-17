const config = require('./config.js');
const _builder = require('./builder.js');
const _sitemap = require('./sitemap.js');

module.exports = () => {
	if (config.doInitializationCheck()) {
		const site = _builder.readTarget(config.target, config.exts, _builder.createPageFile);

		_sitemap.create(site);
		_builder.copyStaticDirs(config.staticDirs);
	}
};
