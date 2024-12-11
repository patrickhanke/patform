import useDataHandler from './useDataHandler';
import { MessageTypes } from '@/types';

const useMessageHandler = () => {
	const {createData} = useDataHandler();

	const createMessageHandler = async (type: MessageTypes.MessageTypes, id: string, users: string[] ) => {
		const updateObject: MessageTypes.MessageUpdateObject = {
			is_read: false
		};  

		if (type === 'task_created') {
			updateObject.task = {__type: 'Pointer', className: 'Task', objectId: id};
		}
        

		if (type === 'ticket_created') {
			updateObject.ticket = {__type: 'Pointer', className: 'Ticket', objectId: id};
		}
		users.forEach(user => {
			createData({
				className: 'Message',   
				updateObject: {
					...updateObject,
					user: {__type: 'Pointer', className: '_User', objectId: user}
				}
			});
		});
	};

	return createMessageHandler;
};

export default useMessageHandler;