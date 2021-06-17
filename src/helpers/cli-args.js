const args = process.argv.splice(2);
const themes = require('./themes.js');
const inArgs = _args => args.some(k => _args.includes(k));

module.exports = {
	command: args[0],
	debug: inArgs(['-d', '--debug']),
	quiet: inArgs(['-q', '--quiet']),
	theme: Object.keys(themes).find(item => args.includes(`--${item}`)),
	params: [...args].splice(1).filter(arg => !arg.trim().startsWith('-')),
};
