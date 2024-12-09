import { useContext, useMemo } from 'react';
import { Options, StateDisplayComponent } from '../types';
import { AppContext, absence_state_options, absence_type_options, daytime_state_options, task_state_options } from '@/provider';
import ticket_state_options from '@/provider/constants/ticket_state_options';

const useGetState = ({type, state}: {type: StateDisplayComponent<'no-state'>['type'], state: StateDisplayComponent<'no-state'>['state'] }) => {
	const {roles} = useContext(AppContext);
	
	const stateObject = useMemo(()=> {
		let value: Options<typeof type>[number] = {
			value: '',
			id: '',
			label: '',
			color: ''
		};

		let options: Options<typeof type>  = [];

		if (type === 'Absence') {
			const option = absence_state_options.find(option => option.value === state);
			options = absence_state_options;

			if (option) {
				value = option;
			}
		}
		if (type === 'Task') {
			const option = task_state_options.find(option => option.value === state);
			options = task_state_options;

			if (option) {
				value = option;
			}
		}
		if (type === 'AbsenceType') {
			const option = absence_type_options.find(option => option.value === state);
			options = absence_type_options;
			if (option) {
				value = option;
			}
		}
		if (type === 'Role') {
			const roleOptions = roles.map((role) => ({id: role.value, value: role.type, label: role.label, color: role.color}));
			const option = roleOptions.find((role) => role.value === state);
			options = roleOptions;
			if (option) {
				value = option;
			}
		}
		if (type === 'TicketState') {
			const option = ticket_state_options.find(option => option.value === state);
			options = ticket_state_options;

			if (option) {
				value = option;
			}
		}
		if (type === 'DayTime') {
			const option = daytime_state_options.find(option => option.value === state);
			options = daytime_state_options;

			if (option) {
				value = option;
			}
		}

		return ({value, options});
	}, [type, state, roles]);

	return {
		stateObject: stateObject.value,
		options: stateObject.options
	};
};

export default useGetState;