import { DateTypes } from '@types';

const getIsoFromDate = (date: Date) => {
	const datum = date || new Date();

	const isoDateTime = new Date(datum.getTime() - (datum.getTimezoneOffset() * 60000)).toISOString();
	return isoDateTime as DateTypes.TDateISO;
};

export default getIsoFromDate;