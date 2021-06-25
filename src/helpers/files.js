const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const rimraf = require('rimraf');

module.exports = {
	exists(where) {
		return fs.existsSync(where);
	},

	readFile(filePath) {
		return fs.readFileSync(filePath, 'utf-8');
	},

	listDir(dirPath) {
		return fs.readdirSync(path.resolve(dirPath));
	},

	isDir(dirPath) {
		return this.exists(dirPath) && fs.lstatSync(dirPath).isDirectory();
	},

	fileExt(filePath) {
		return path.parse(filePath).ext;
	},

	fileName(filePath) {
		return path.parse(filePath).name;
	},

	createDir(dir) {
		fs.mkdirSync(dir);
	},

	cleanDir(dir) {
		if (!this.isDir(dir)) {
			throw new Error(`Not a directory: "${dir}"`);
		}
		
		rimraf.sync(dir);
		this.createDir(dir);
	},

	copyDir(from, to, cb) {
		if (!this.isDir(from)) {
			throw new Error(`Not a directory: "${from}"`);
		}

		if (this.isDir(to)) {
			throw new Error(`Directory already exists: "${to}"`);
		}
				
		fse.copySync(from, to);
		cb && cb(from, to);
	},

	removeStartSlash(str) {
		if (str.startsWith('/') || str.startsWith('\\')) {
			str = str.substr(1, str.length);
		}

		return str;
	},	
};
