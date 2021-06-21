const aliases = require('../src/helpers/aliases.js');

describe('Testing aliases', () => {
  it('Aliases must be immutable', () => {
    const len = aliases.length;
    aliases.test = 'Testing immutability';
    expect(len).toEqual(aliases.length);
  });
});