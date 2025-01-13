const getDateString = (date: string | Date): {date: string, time: string} => {
	const dateObject: Date = new Date(date);
    
	if (dateObject.toString() !== 'Invalid Date') {
		const year = dateObject.getFullYear();
		const month = dateObject.getMonth() + 1;
		const day = dateObject.getDate();

		const hours = dateObject.getHours();
		const minutes = dateObject.getMinutes() < 10 ? `0${dateObject.getMinutes()}` : dateObject.getMinutes();
		return {
			date: `${day}.${month}.${year}`,
			time: `${hours}:${minutes}`
		};
	}

	return {
		date: '',
		time: ''
	};
};

export default getDateString;