const path = require('path');
const _files = require('./../../helpers/files.js');

/**
 * The autoInclude will search for each key here
 * as an html|hbs|md file on the target root and
 * will add this file content as a prop available
 * on the hbs compiler. This files will be auto-
 * included or ignored by the builder.
 */
const AUTO_INCLUDE_LIST = [
	'head',
	'footer',
	'header',
	'sidebar',
	'before-content',
	'after-content',
];

module.exports = {
	getAutoIncludeFileList(target, exts) {
		list = [];

		AUTO_INCLUDE_LIST.forEach(item => {
			exts.forEach(ext => {
				list.push(path.resolve(target, `${item}${ext}`));
			});
		});

		return list;
	},

	getAutoIncludes(target, exts) {
		const result = {};
		const list = this.getAutoIncludeFileList(target, exts);

		list.forEach(filePath => {
			const name = path.parse(filePath).name;

			if (!result[name] && _files.exists(filePath)) {
				result[name] = _files.readFile(filePath);
			}
		});

		return result;
	},

	getAutoIgnore(target, exts, staticDirs) {
		const autoIncludeFileList = this.getAutoIncludeFileList(target, exts);
		const staticDirsReserveds = [];

		staticDirs.forEach(item => {
			exts.forEach(ext => {
				list.push(path.resolve(target, `${item}${ext}`));
			});
		});

		return [...autoIncludeFileList, ...staticDirsReserveds];
	},
};
