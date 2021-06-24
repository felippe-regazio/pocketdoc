const path = require('path');
const files = require('../src/helpers/files.js');
const filesDir = path.join(__dirname, 'files');
const rimraf = require('rimraf');

describe('Test files operations helper', () => {
  it('fileExists', () => {
    expect(files.exists(`${filesDir}/test-file.html`)).toBe(true);
    expect(files.exists(`${filesDir}/test-file-false.html`)).toBe(false);
  });

  it('readFile', () => {
    expect(files.readFile(`${filesDir}/test-file.html`)).toBe('<h1>it works</h1>');

    try {
      files.readFile(`${filesDir}/test-file-false.html`)
    } catch(error) {
      expect(error.code).toEqual('ENOENT');
    }
  });

  it('listDir', () => {
    const dirList = files.listDir(filesDir);
    expect(Array.isArray(dirList)).toBe(true);
    expect(dirList.length).toBeGreaterThan(0);

    try {
      files.listDir('fake-dir');
    } catch(error) {
      expect(error.code).toEqual('ENOENT');
    }
  });

  it('isDir', () => {
    expect(files.isDir(filesDir)).toBe(true);
    expect(files.isDir('fake-dir')).toBe(false);
  });

  it('fileExt', () => {
    expect(files.fileExt(`${filesDir}/test-file.html`)).toBe('.html');

    try {
      files.fileExt(`${filesDir}/test-file-fake.html`);
    } catch(error) {
      expect(error.code).toEqual('ENOENT');
    }
  });

  it('fileName', () => {
    expect(files.fileName(`${filesDir}/test-file.html`)).toBe('test-file');

    try {
      files.fileName(`${filesDir}/test-file-fake.html`);
    } catch(error) {
      expect(error.code).toEqual('ENOENT');
    }
  });

  it('createDir', () => {
    const testDir = `${filesDir}/testing`;

    if (files.isDir(testDir)) {
      rimraf.sync(testDir);
    }

    try {
      files.createDir(testDir);
    } catch(error) {
      expect(error).toBe(null);
      expect(files.isDir(testDir)).toBe(true);
    }

    try {
      files.createDir(testDir);
    } catch(error) {
      expect(error.code).toEqual('EEXIST');
    }

    try {
      files.createDir(`${testDir}/testing/nesting/test`);
    } catch(error) {
      expect(error.code).toEqual('ENOENT');
    }
  });

  it('cleanDir', () => {
    const testDir = `${filesDir}/testing`;

    try {
      files.createDir(`${testDir}/testing/another`);
    } catch(error) {
      expect(error).toBe(null);
      expect(files.isDir(testDir)).toBe(true);
    }    

    try {
      files.cleanDir(testDir);
    }
  });
});