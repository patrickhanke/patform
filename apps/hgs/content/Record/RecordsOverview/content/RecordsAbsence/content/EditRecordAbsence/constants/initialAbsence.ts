import { Absence, UserDisplayData } from '@/types';

const initialAbsence: Omit<Absence, 'user'> & {user?: UserDisplayData | undefined} = {
	objectId: '',
	user: undefined,
	start_date: '',
	end_date: '',
	state: 'created',
	comment: '',
	type: '' as Absence['type'],
	year: new Date().getFullYear()
};

export default initialAbsence;