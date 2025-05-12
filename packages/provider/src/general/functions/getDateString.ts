export const getDateString = (datum: string | undefined | Date) => {
	if (!datum) return { date: "", time: "", dateTime: "" };

	const date = new Date(datum);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const hours = date.getHours();
	const minutes =
		date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
	return {
		date: `${day}.${month}.${year}`,
		time: `${hours}:${minutes}`,
		dateTime: `${day}.${month}.${year} ${hours}:${minutes}`
	};
};

export default getDateString;
