export const getDateStringsFromIso = (datum: Date | string | undefined) => {
	if (!datum) return {datum: '-', uhrzeit: '-'};
	const date = new Date(datum);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const hours = date.getHours();
	const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
	return {
		datum: `${day}.${month}.${year}`,
		uhrzeit: `${hours}:${minutes}`
	};
};

export default getDateStringsFromIso;