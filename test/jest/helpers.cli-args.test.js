const mockCommandArgv = (call = '') => {
  const argfy = call.split(' ').map(item => item.trim());

  process.argv = [
    '/usr/bin/node',
    '/pocketdoc/src/cli.js',
    ...argfy
  ];
};

describe('Test cli arguments reading', () => {
  beforeEach(() => jest.resetModules());

  it('$ generate', () => {
    mockCommandArgv('generate');
    const args = require('../../src/helpers/cli-args.js');
    
    expect(args.command).toBe('generate');
    expect(args.debug && args.quiet).toBe(false);
    expect(args.theme).toBe(undefined);
    expect(Array.isArray(args.params)).toBe(true);
    expect(args.params.length).toBe(0);
  });

  it('$ generate from to', () => {
    mockCommandArgv('generate from to');
    const args = require('../../src/helpers/cli-args.js');
    
    expect(args.command).toBe('generate');
    expect(args.debug && args.quiet).toBe(false);
    expect(args.theme).toBe(undefined);
    expect(Array.isArray(args.params)).toBe(true);
    expect(args.params[0]).toBe('from');
    expect(args.params[1]).toBe('to');
  });

  it('$ generate from to --quiet --debug', () => {
    mockCommandArgv('generate from to --quiet --debug');
    const args = require('../../src/helpers/cli-args.js');
    
    expect(args.command).toBe('generate');
    expect(args.debug && args.quiet).toBe(true);
    expect(args.theme).toBe(undefined);
    expect(Array.isArray(args.params)).toBe(true);
    expect(args.params[0]).toBe('from');
    expect(args.params[1]).toBe('to');
  });

  it('$ generate from to --quiet --debug --black-and-white', () => {
    mockCommandArgv('generate from to --quiet --debug --black-and-white');
    const args = require('../../src/helpers/cli-args.js');
    
    expect(args.command).toBe('generate');
    expect(args.debug && args.quiet).toBe(true);
    expect(args.theme).toBe('black-and-white');
    expect(Array.isArray(args.params)).toBe(true);
    expect(args.params[0]).toBe('from');
    expect(args.params[1]).toBe('to');
  });

  it('$ generate -q -d --black-and-white from to', () => {
    mockCommandArgv('generate from to -q -d --black-and-white');
    const args = require('../../src/helpers/cli-args.js');
    
    expect(args.command).toBe('generate');
    expect(args.debug && args.quiet).toBe(true);
    expect(args.theme).toBe('black-and-white');
    expect(Array.isArray(args.params)).toBe(true);
    expect(args.params[0]).toBe('from');
    expect(args.params[1]).toBe('to');
  });

  it('$ generate --black-and-white from', () => {
    mockCommandArgv('generate --black-and-white from');
    const args = require('../../src/helpers/cli-args.js');
    
    expect(args.command).toBe('generate');
    expect(args.debug && args.quiet).toBe(false);
    expect(args.theme).toBe('black-and-white');
    expect(Array.isArray(args.params)).toBe(true);
    expect(args.params[0]).toBe('from');
  });

  it('$ serve --black-and-white from', () => {
    mockCommandArgv('serve --black-and-white from');
    const args = require('../../src/helpers/cli-args.js');
    
    expect(args.command).toBe('serve');
    expect(args.debug && args.quiet).toBe(false);
    expect(args.theme).toBe('black-and-white');
    expect(Array.isArray(args.params)).toBe(true);
    expect(args.params[0]).toBe('from');
  });

  it('$ serve -q -d --black-and-white from to', () => {
    mockCommandArgv('serve -q -d --black-and-white from to');
    const args = require('../../src/helpers/cli-args.js');
    
    expect(args.command).toBe('serve');
    expect(args.debug && args.quiet).toBe(true);
    expect(args.theme).toBe('black-and-white');
    expect(Array.isArray(args.params)).toBe(true);
    expect(args.params[0]).toBe('from');
    expect(args.params[1]).toBe('to');
  });

  ['version', 'help', 'themes'].forEach(cmd => {
    it(`$ ${cmd}`, () => {
      mockCommandArgv(cmd);
      const args = require('../../src/helpers/cli-args.js');
  
      expect(args.command).toBe(cmd);
    });
  });
});