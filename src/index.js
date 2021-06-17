const args = require('./args.js');
const generate = require('./commands/generate/');

module.exports = function pocketDoc(options) {
	args.setArgs({ ...options, params: [options.from, options.dest] });

	return generate();
};
