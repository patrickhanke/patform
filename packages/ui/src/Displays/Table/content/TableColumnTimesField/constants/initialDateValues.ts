import {  EventTime } from '@repo/types';

const initialTimeValues: EventTime = {
	id: '' as string,
	start: '',
	end: '',
	weekday: '',
	place: {
		type:'map',
		address: '',
		map: {},
		online: ''
	}
};

export default initialTimeValues;