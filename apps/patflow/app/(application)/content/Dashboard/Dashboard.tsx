'use client';

import { Page, UserMessages } from '@repo/ui';
import { deleteAllNotifications } from '@repo/provider';
import { useContext, useMemo } from 'react';
import { NotificationContext } from '@repo/provider';

const Dashboard = () => {
	const {notifications, setNotificationsToRead, deleteNotification} = useContext(NotificationContext);

	const pageHeaderButtons = useMemo(() => [
		{
			text: 'Alle Nachrichten löschen ',
			onClick: () => 	deleteAllNotifications(),
			value: 'new_message',
			color: 'primary',
			disabled: notifications.length === 0
		}

	], [notifications]);
	
	return (
		<Page 
			title='Dashboard'
			pageHeaderButtons={pageHeaderButtons}
		>
			<UserMessages
				notifications={notifications}
				setNotificationsToRead={setNotificationsToRead}
				deleteNotification={deleteNotification}
			
			/>
		</Page>
	);
};

export default Dashboard;