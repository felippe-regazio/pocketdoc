const config = require('./config.js');
const _builder = require('./builder.js');
const _sitemap = require('./sitemap.js');

module.exports = () => {
	console.log(`Generating static files\n\nFrom: ${config.target}\nDest: ${config.dest}\nTheme: ${config.theme || 'default'}\n`);
	Object.keys(config.autoInclude).forEach(file => console.log(`Added template auto-include for: ${file}`));
	Object.keys(config.autoInclude).length && console.log('');

	if (config.doInitializationCheck()) {
		const site = _builder.readTarget(config.target, config.exts, async pageInfo => {
			await _builder.createPageFile(pageInfo);
		});

		_sitemap.create(site);
		_builder.copyStaticDirs(config.staticDirs);

		console.log('\nDone');
	}
}
