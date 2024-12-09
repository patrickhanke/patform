import { Absence, Record } from '@/types';
import { getDayOfYear, setDayOfYear } from 'date-fns';
import getIsoFromDate from './getIsoFromDate';

const getDatesFromAbsences = (records: Record[]) => {
	const absenceDates: string[] = [];	
	const abseceDays: number[] = [];
	const absenceObjects: {day: number, type: string}[] = [];
	records.forEach(record => {
		if (!record.absence) return;
		
		record.absence.forEach((absence: Absence) => {
			for (let i = getDayOfYear(new Date(absence.start_date)); i <= getDayOfYear(new Date(absence.end_date)); i+=1) {
				const date = setDayOfYear(new Date(), i);
				if (!abseceDays.includes(i)) { 
					absenceDates.push(getIsoFromDate(date));
					abseceDays.push(i);
					absenceObjects.push({day: i, type: absence.type as Absence['type']});
				}
			}
		});
	});
	
	return ({absenceDates, abseceDays, absenceObjects});
};

export default getDatesFromAbsences;