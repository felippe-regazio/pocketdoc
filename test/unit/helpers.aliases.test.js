const aliases = require('../../src/helpers/aliases.js');

describe('Test cli aliases', () => {
  it('Aliases must be immutable', () => {
    const len = aliases.length;
    aliases.test = 'Testing immutability';
    expect(len).toEqual(aliases.length);
  });
});