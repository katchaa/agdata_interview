/*
    Imports
*/
import { writeFile } from 'fs';
import xlsx from 'xlsx';
import { loopOneDimensionalArray, loopTwoDimensionalArray } from './helpers.js';

/*
    Values for source and target file from terminal, initial JSON array
 */
const sourceFile = process.argv[2];
const targetFile = process.argv[3];
let json = [];

/*
    Reading xls file
*/
const { readFile, utils } = xlsx;
const workBook = readFile(sourceFile);

/*
    Loop through workBook sheets
*/
for (let i = 0; i < workBook.SheetNames.length; i++) {
	const sheetName = workBook.SheetNames[i];
	const workSheet = workBook.Sheets[sheetName];
	const data = utils.sheet_to_json(workSheet, { header: 1 });
	const keys = data.shift();

	/*
    Recursive function, dividing data from workSheet into groups
    */
	let groups = [];
	const splitDataToGroups = (data) => {
		if (data.length) {
			let metaRow = data.find((row) => row[0] === undefined);
			let index = data.indexOf(metaRow);
			let group = data.splice(0, index + 1);
			groups.push(group);

			splitDataToGroups(data);
		}
		return;
	};
	splitDataToGroups(data);

	/*
    Creating object for every group
    */
	for (let group of groups) {
		/*
        Selecting data
        */
		let name = group.at(-2).shift();
		let averageArr = group.at(-2).splice(0, keys.length);
		let metaArr = group.at(-1).splice(1, keys.length);
		let samplesArr = group.splice(0, group.length - 2);

		/*
        Loop through the arrays, assign key to correct array's value
        */
		let average = {};
		loopOneDimensionalArray(averageArr, average, keys);

		let meta = {};
		loopOneDimensionalArray(metaArr, meta, keys);

		let samples = [];
		loopTwoDimensionalArray(samplesArr, samples, keys);

		/*
        Object for every group
        */
		let finalObject = {
			name,
			samples,
			average,
			meta,
		};
		json.push(finalObject);
	}
}

/*
Create final JSON file
*/
writeFile(targetFile, JSON.stringify(json), (err) => {
	if (err) {
		console.log(err.msg);
	}
	console.log(`Data has written to file ${targetFile}`);
});

