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
    return path.parse(filePath).ext
  },

  fileName(filePath) {
    return path.parse(filePath).name
  },

  createDir(dir) {
    fs.mkdirSync(dir);
  },

  cleanDir(dir) {
    rimraf.sync(dir);
    this.createDir(dir);
  },

  removeStartSlash(str) {
    if(str.startsWith('/') || str.startsWith('\\')) {
      str = str.substr(1, str.length);
    }

    return str;
  },

  copyDir(from, to, cb) {
    fse.copySync(from, to);
    cb && cb(from, to);
  }
}