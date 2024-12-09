import { DateTypes } from '@/types';

const getDateFromIso = (isoDate: DateTypes.TDateISO) : Date => {
	let dateTime = new Date();
	if (isoDate) {
		dateTime = new Date(isoDate.slice(0, -1));
	}
	return dateTime;
};

export default getDateFromIso;