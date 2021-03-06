const cliArgs = require('./helpers/cli-args.js');

class Args {
	constructor(args = cliArgs) {
		this.setArgs(args);
	}

	setArgs(args) {
		Object.assign(this, args);
	}

	setArg(arg, value) {
		this[arg] = value;
	}
}

module.exports = new Args();
