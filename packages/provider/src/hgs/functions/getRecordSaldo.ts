import { getSaldo } from '@/provider';
import { Day, Record } from '@/types';

const getRecordSaldo: (
    start_date: string,
    end_date: string,
    record_time: Record['default_times'],
    days: Day[]
)=> number = (
	start_date, 
	end_date, 
	record_time, 
	days
) => {
	let saldo = 0;
	record_time.forEach((time) => {
		const date = new Date(time.date).getTime();    
		if (date >= new Date(start_date).getTime() && date <= new Date(end_date).getTime()) {
			const dayIndex = days.findIndex((day) => day.date === time.date); 
			
			if (dayIndex !== -1 && days[dayIndex].type === 'work' &&  days[dayIndex].time) {
				const daySaldo = getSaldo(days[dayIndex].time, time.default_time);
				saldo += daySaldo;
			} else if (time.type === 'absence') {
				if (time.default_time?.type === 'regular') {
					const timeSpan = time.default_time?.duration - time.default_time?.pause;
					saldo += timeSpan;
				}

			} else if (time.default_time?.type === 'regular') {
				const timeSpan = time.default_time?.duration - time.default_time?.pause;
				saldo -= timeSpan;
			}
		}
	});

	return saldo;
};

export default getRecordSaldo;