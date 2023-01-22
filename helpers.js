export const loopOneDimensionalArray = (source, target, keys) => {
	for (let i = 1; i < keys.length; i++) {
		if (source[i] === undefined) {
			source[i] = '';
		}
		target[keys[i]] = source[i - 1];
	}
};

export const loopTwoDimensionalArray = (source, target, keys) => {
	let obj = {};
	for (let i = 0; i < source.length; i++) {
		for (let j = 0; j < source[i].length; j++) {
			if (source[i][j] === undefined) {
				source[i][j] = '';
			}
			obj[keys[j]] = source[i][j];
		}
		target.push({ ...obj });
	}
};

