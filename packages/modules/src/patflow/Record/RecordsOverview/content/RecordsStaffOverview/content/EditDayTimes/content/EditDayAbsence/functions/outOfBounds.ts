const outOfBounds = ({
	date,
	year
}: {
	date: string;
	year: number;
}): boolean => {
	if (!date || !year) {
		return false;
	}

	const dateObj = new Date(date);
	const dateYear = dateObj.getFullYear();

	return dateYear !== year;
};

export default outOfBounds;
