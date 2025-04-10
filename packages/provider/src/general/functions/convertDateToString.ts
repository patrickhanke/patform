import { format } from "date-fns";

const convertDateToString = (date: Date | string): string => {
	let dateValue: Date = new Date();
	if (date) {
		dateValue = new Date(date);
	}
	const formattedDate = format(dateValue, "yyyy-MM-dd'T'HH:mm:ss");

	return formattedDate;
};

export default convertDateToString;
