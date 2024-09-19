import {  EventDate } from '@repo/types';

const initialDateValues: EventDate = {
	id: '' as string,
	start: '',
	end: '',
	label: '',
	location: {
		type:'map',
		address: '',
		map: {},
		online: ''
	},
	full_day: false
};

export default initialDateValues;