'use client';

// import { UserContext, sortArrayForDivider, useDataHandler } from '@provider';
import { useContext, useEffect } from 'react';
import styles from './UserMessage.module.scss';
import clsx from 'clsx';
import { NotificationContext } from '@repo/provider';
import { Notification } from '@repo/types';
import RenderNotification from './components/RenderNotification';

const UserMessages = () => {
	const {notifications, setNotificationsToRead, deleteNotification} = useContext(NotificationContext);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				console.log('Visible');
				setNotificationsToRead();
			} 
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	console.log(notifications);

	if (!notifications || notifications.length === 0) {
		return <div><p>Gegenwärtig keine neuen Nachrichten vorhanden</p></div>;
	}
	
	return (
		<>
			<h3>Nachrichten</h3>
			<div className={clsx('content_element', 'no_padding', styles.user_messages_container)}>
				{notifications && notifications.map((notification: Notification & {divider?:boolean}) => (
					<RenderNotification 
						key={notification.id} 
						title={notification.title} 
						body={notification.body} 
						timestamp={notification.timestamp} 
						read={notification.read}
						image={notification.image}
						id={notification.id}
						deleteNotification={deleteNotification}
					/>
				))}
			</div>
		</>
	);
};

export default UserMessages;