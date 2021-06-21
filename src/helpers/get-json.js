/**
 * This a modified version of package extract-json-from-string
 * https://www.npmjs.com/package/extract-json-from-string
 *
 * Original module by: Andrew Nichols
 * https://www.npmjs.com/~tandrewnichols
 */
const jsonify = (almostJson) => {
	try {
		return JSON.parse(almostJson);
	} catch (e) {
		almostJson = almostJson.replace(/([a-zA-Z0-9_$]+\s*):/g, '"$1":').replace(/'([^']+?)'([\s,\]\}])/g, '"$1"$2');
		return JSON.parse(almostJson);
	}
};

const chars = {
	'[': ']',
	'{': '}',
};

const any = (iteree, iterator) => {
	let result;
	for (let i = 0; i < iteree.length; i++) {
		result = iterator(iteree[i], i, iteree);
		if (result) {
			break;
		}
	}
	return result;
};

const extract = (str) => {
	const startIndex = str.search(/[\{\[]/);
	if (startIndex === -1) {
		return null;
	}

	const openingChar = str[startIndex];
	const closingChar = chars[openingChar];
	let endIndex = -1;
	let count = 0;

	str = str.substring(startIndex);
	any(str, (letter, i) => {
		if (letter === openingChar) {
			count++;
		} else if (letter === closingChar) {
			count--;
		}

		if (!count) {
			endIndex = i;
			return true;
		}
	});

	if (endIndex === -1) {
		return null;
	}

	const obj = str.substring(0, endIndex + 1);
	return obj;
};

module.exports = (str) => {
	let result;
	const objects = [];

	while ((result = extract(str)) !== null) {
		try {
			const obj = {
				obj: jsonify(result),
				str: result,
			};

			objects.push(obj);
		} catch (error) {}

		str = str.replace(result, '');
	}

	return objects;
};