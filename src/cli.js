#!/usr/bin/env node
const args = require('./args.js');
const aliases = require('./helpers/aliases.js');
const command = aliases[ args.command ] || args.command;

if (args.quiet) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

try {
  const cmd = require(`./commands/${command}/`);

  typeof cmd === 'function' && cmd();
} catch (error) {
  args.debug ?
    console.error(error) :
    require('./commands/help');
}