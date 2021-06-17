const path = require('path');
const args = require('./../../args.js');
const themes = require('./../../helpers/themes.js');

const exts = ['.md', '.html', '.hbs'];
const staticDirs = ['assets', 'public'];

const _files = require('./../../helpers/files.js');
const _autoincl = require('./autoincl.js');

const target = path.resolve(process.cwd(), args.params[0] || '');
const dest = path.resolve(args.params[1] || './docs');

const configJsonPath = path.resolve(target, 'pocketdoc.config.json');
const configJson = _files.exists(configJsonPath) ? require(configJsonPath) : {};

const baseCss = _files.readFile(require.resolve('plume-css'));
const theme = themes[args.theme || configJson.theme] || '';

const hsltTheme = configJson.codeHighlightTheme || 'a11y-dark';
const hsltCss = _files.readFile(path.resolve(__dirname, '../../../node_modules/highlight.js/styles/', `${hsltTheme}.css`));

module.exports = {
	dest,
	exts,
	theme,
	target,
	baseCss,
	hsltCss,
	configJson,
	configJsonPath,
	staticDirs: staticDirs,
	autoInclude: _autoincl.getAutoIncludes(target, exts),
	autoIgnore: _autoincl.getAutoIgnore(target, exts, staticDirs),

	doInitializationCheck() {
		if (!_files.isDir(this.target)) {
			throw new Error(`Invalid source directory "${this.target}"`);
		}

		if (_files.exists(this.dest) && !_files.isDir(this.dest)) {
			throw new Error(`Invalid destination: "${this.dest}"`);
		}

		if (!_files.exists(this.dest)) {
			_files.createDir(this.dest);
		}

		if (_files.exists(this.dest) && _files.isDir(this.dest)) {
			_files.cleanDir(this.dest);
		}

		return true;
	},
};
