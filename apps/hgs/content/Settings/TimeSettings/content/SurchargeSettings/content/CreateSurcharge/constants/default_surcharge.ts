import { Surcharge } from '@/types';

const default_surcharge = () => ({
	name: '',
	type: 'time' as Surcharge['type'],
	time_value: {start: '00:00', end: '00:00'},
	day_value: [],
	work_value: {},
	value: 0,
	active: true,
	start_date: '',
	end_date: null
});

export default default_surcharge;