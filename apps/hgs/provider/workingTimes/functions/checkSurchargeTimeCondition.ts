import { CheckSurchargeCondition } from '../types';

const checkSurchargeTimeCondition: CheckSurchargeCondition = ({day, surcharge}) => {
	if (day.working_time.start) {
		const start = new Date(day.working_time.start).getTime();
		const end = new Date(day.working_time.end).getTime();
		const surchargeStart = new Date(surcharge.time_value.start).getTime();
		const surchargeEnd = new Date(surcharge.time_value.end).getTime();
		if (start < surchargeStart && surchargeStart < end && end < surchargeEnd) {
			return end - surchargeStart;
		}
		if (start < surchargeStart && end >= surchargeEnd) {
			return surchargeEnd - surchargeStart;
		}
		if (start >= surchargeStart && end <= surchargeEnd) {
			return end - start;
		}
		if (start >= surchargeStart && start < surchargeEnd && end > surchargeEnd) {
			return surchargeEnd - start;
		}
	}
	return 0;
};

export default checkSurchargeTimeCondition;