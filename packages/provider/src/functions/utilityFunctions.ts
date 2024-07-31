import { flattenDeep, isArray } from 'lodash';

export function slugify(string: string) {
	const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
	const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
	const p = new RegExp(a.split('').join('|'), 'g');

	return string.toString().toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
		.replace(/&/g, '-and-') // Replace & with 'and'
		.replace(/[^\w\-]+/g, '') // Remove all non-word characters
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

export const flattenObject = (object: object) =>  {
	let returnValues = {};
	Object.keys(object).forEach(key => {
		if (isArray(object[key] as object[]) ) {
			const flatenedArray = flattenDeep(object[key]);
			flatenedArray.forEach((value) => {
				if (typeof value === 'object') {
					returnValues = {...returnValues, ...value};
				}
			});

		} else if (typeof object[key] === 'object') {
			returnValues = {...returnValues, ...object[key]};
		}
	});
	return returnValues;
};

null