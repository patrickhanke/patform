import { format } from "date-fns";

const convertDateToString = (date: Date | string): string => {
	let dateValue: Date = new Date();

	console.log({ date });
	if (date) {
		const newDateValue = new Date(date);
		console.log({ newDateValue });
		if (isNaN(newDateValue.getTime())) {
			dateValue = new Date();
		} else {
			dateValue = newDateValue;
		}
	}
	const formattedDate = format(dateValue, "yyyy-MM-dd'T'HH:mm:ss");

	return formattedDate;
};

export default convertDateToString;
