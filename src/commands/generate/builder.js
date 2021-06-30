const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const config = require('./config.js');

const _page = require('./page.js');
const _files = require('./../../helpers/files.js');

module.exports = {
	readTarget(dirPath, filterExts = [], callback, result) {
		if (!result) result = { [dirPath]: {} };

		_files.listDir(dirPath)
			.map(itemPath => path.resolve(dirPath, itemPath))
			.forEach(itemPath => {
				if (_files.isDir(itemPath)) {
					this.readTarget(itemPath, filterExts, callback, result);
				} else {
					const isExtAllowed = !filterExts.length || filterExts.includes(_files.fileExt(itemPath));
					const mustIgnore = this.mustIgnore(itemPath);

					if (!mustIgnore && isExtAllowed) {
						result[dirPath] = result[dirPath] || {};
						const pageInfo = this.buildPageInfo(itemPath);

						Object.assign(result[dirPath], {
							[itemPath]: pageInfo,
						});

						callback(pageInfo);
					}
				}
			});

		return result;
	},

	buildPageInfo(filePath) {
		const info = path.parse(filePath);

		info.destFileName = this.slugifyAsUrl(info.name);
		info.relativeDir = this.slugifyAsUrl(_files.removeStartSlash(info.dir.replace(config.target, '')));
		info.destDir = path.resolve(config.dest, this.slugifyAsUrl(info.relativeDir));
		info.source = _files.readFile(filePath);
		info.metadata = _page.extractPageMetadata(info);
		info.contentHtml = info.ext === '.md' ? _page.markdownCompile(info) : info.source;
		info.pageHtml = _page.generatePageHtmlFor(info);

		return info;
	},

	mustIgnore(itemPath) {
		const isUserIgnored = config.configJson &&
			config.configJson.ignore && config.configJson.ignore.includes(itemPath);

		return config.autoIgnore.includes(itemPath) || isUserIgnored;
	},

	slugifyAsUrl(str) {
		str = str
			.replace(/\//g, 'token_not_to_replace_slash')
			.replace(/\\/g, 'token_not_to_replace_backslash');

		str = slugify(str, { lower: true });

		return str
			.replace(/token_not_to_replace_slash/g, '/')
			.replace(/token_not_to_replace_backslash/g, '\\');
	},

	createPageFile(pageInfo) {
		const saveTo = pageInfo.name.toLowerCase() != 'index' ?
			path.resolve(pageInfo.destDir, pageInfo.destFileName) : pageInfo.destDir;

		fs.mkdirSync(saveTo, { recursive: true });
		const saveToFile = path.resolve(saveTo, 'index.html');

		return new Promise((resolve, reject) => {
			console.log(`Creating ${saveToFile}`);

			fs.writeFile(saveToFile, pageInfo.pageHtml, 'utf-8', error => {
				if (error) {
					console.error(`Error while creating file: "${saveToFile}"`);
					config.args.debug && console.error(error);

					reject(err);
				} else {
					resolve(pageInfo);
				}
			});
		});
	},

	copyStaticDirs(dirs = []) {
		dirs.forEach(dir => {
			const dirPath = path.resolve(config.target, dir);
			const destPath = path.resolve(config.dest, dir);
			const mustCopy = _files.exists(dirPath) && _files.isDir(dirPath);

			mustCopy && console.log(`Copying static dir "${dir}"`);
			mustCopy && _files.copyDir(dirPath, destPath);
		});
	},
};
