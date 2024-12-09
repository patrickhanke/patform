import { getDateStringsFromIso } from '@/provider';
import { FIND_ALL_USERS } from '@/queries';
import { DashboardTypes, Message, User } from '@/types';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

const useGetMessagesContent = (messages: Message[]): DashboardTypes.MessageContent[] => {
	const {data} = useQuery(FIND_ALL_USERS);
	
	const messagesContent = useMemo(() => {
		const message_content: DashboardTypes.MessageContent[] = [];
		const users = data?.objects.find_User.results;
		
		if (!users) return message_content;

		messages.forEach((message) => { 
			const user = users?.find((user: User) => user.objectId === message?.created_by?.objectId);
			if (message.type === 'task_created') {
				message_content.push({
					objectId: message.objectId,
					createdAt: message.createdAt,
					type: message.type,
					headline: 'Aufgabe erstellt',
					content: `${user?.first_name} ${user?.family_name} hat eine neue Aufgabe erstellt.`,
					link: `/tasks?task=${message?.task?.objectId}`,
					time: `${getDateStringsFromIso(message.createdAt).datum} - ${getDateStringsFromIso(message.createdAt).uhrzeit}`,
					is_read: message.is_read 
				});
			} 
			if (message.type === 'ticket_created') {
				message_content.push({
					objectId: message.objectId,
					createdAt: message.createdAt,
					type: message.type,
					headline: 'Ticket erstellt',
					content: `${user?.first_name} ${user?.family_name} hat eine neues Ticket erstellt.`,
					link: `/tickets?ticket=${message?.ticket?.objectId}`,
					time: `${getDateStringsFromIso(message.createdAt).datum} - ${getDateStringsFromIso(message.createdAt).uhrzeit}` ,
					is_read: message.is_read
				});
			} 
		});

		return message_content;
	}, [messages, data]);

	return messagesContent;
};

export default useGetMessagesContent;