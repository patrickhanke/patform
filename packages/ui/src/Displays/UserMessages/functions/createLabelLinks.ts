import { NotificationData } from '@repo/types';

const createLabelLinks: (data: NotificationData) => string | null = (data) => {
	if (!data) {
		return null;
	} else {
		if (data.type === 'ticket') {
			return `/tickets/active/ticket=?${data.id || data.ticketId}`;
		} else if (data.type === 'task') {
			return `/tasks/active/?task=${data.id || data.taskId}`;
		}
	}
	return '';
};

export default createLabelLinks;