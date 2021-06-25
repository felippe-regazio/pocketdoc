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

    files.createDir(testDir);
    expect(files.isDir(testDir)).toBe(true);

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

    files.createDir(`${testDir}/another`);
    expect(files.isDir(testDir)).toBe(true);

    files.cleanDir(testDir);
    expect(files.isDir(testDir)).toBe(true);
    expect(files.isDir(`${testDir}/another`)).toBe(false);

    try {
      files.cleanDir('fake-dir');
    } catch(error) {
      expect(error.name).toEqual('Error');
    }
  });

  it('copyDir', () => {
    const testDir = `${filesDir}/testing`;
    const copyTo = path.resolve(testDir, '..', 'test-copy');

    let cbOk = false;

    if (files.isDir(copyTo)) {
      rimraf.sync(copyTo);
    }

    files.copyDir(testDir, copyTo);
    expect(files.isDir(copyTo)).toBe(true);

    rimraf.sync(copyTo);
    files.copyDir(testDir, copyTo, () => { cbOk = true });
    expect(files.isDir(copyTo)).toBe(true);
    expect(cbOk).toBe(true);

    try {
      files.copyDir(testDir, copyTo);
    } catch(error) {
      expect(error.name).toEqual('Error');
    }

    try {
      files.copyDir(`${testDir}/test-file.html`, copyTo);
    } catch(error) {
      expect(error.name).toEqual('Error');
    }

    try {
      files.copyDir(`fake-dir`, copyTo);
    } catch(error) {
      expect(error.name).toEqual('Error');
    }    
  });

  it('removeStartSlash', () => {
    const expectation = {
      '/hello': 'hello',
      '\\hello': 'hello',
      'hello/': 'hello/',
      '//hello': '/hello',
      '\\\\hello': '\\hello',
      '/ hello': ' hello'
    };

    Object.entries(expectation).forEach(entry => {
      expect(files.removeStartSlash(entry[0])).toBe(entry[1]);
    });
  });
});