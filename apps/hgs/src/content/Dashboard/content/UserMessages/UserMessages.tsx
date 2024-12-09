'use client';

import { UserContext, sortArrayForDivider, useDataHandler } from '@/provider';
import { DashboardTypes } from '@/types';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import UserMessage from './components/UserMessage';
import useGetMessagesContent from './hooks/useGetMessagesContent';
import styles from './UserMessage.module.scss';
import clsx from 'clsx';
import SiteHeader from '@/_UI/surfaces/SiteHeader';

const UserMessages = () => {
	const {userMessages, refetchMessages} = useContext(UserContext);
	const {deleteData, updateData} = useDataHandler();
	const [loading, setLoading] = useState(false);
	const messageContent = useGetMessagesContent(userMessages);
	console.log(userMessages);
	

	const setMessageToRead = async (objectId: string) => {
		await updateData({
			className: 'Message',
			objectId,
			updateObject: {
				is_read: true
			}
		});
		refetchMessages();
	};

	const deleteMessageHandler = async (objectId: string) => {
		await deleteData({
			className: 'Message',
			objectId
		});
		refetchMessages();
	};

	const setAllMessagesToRead = useCallback(async () => {
		setLoading(true);
		const messagesToUpdate = userMessages.filter(message => !message.is_read);

		await Promise.all(messagesToUpdate.map(messageToUpdate => updateData({
			className: 'Message',
			objectId: messageToUpdate.objectId,
			updateObject: {
				is_read: true
			}
		})));
		refetchMessages();
		setLoading(false);
	}, [userMessages]);

	const deleteAllMessages = useCallback(async () => {
		setLoading(true);

		await Promise.all(userMessages.map(messageToUpdate => deleteData({
			className: 'Message',
			objectId: messageToUpdate.objectId
		})));
		refetchMessages();
		setLoading(false);
	}, [userMessages]);

	const siteHeaderContent = useMemo(() => {
		return (
			<div className={styles.siteheader_content}>
				<button 
					className='border_button md dark'
					onClick={() => setAllMessagesToRead()}
					disabled={loading}
				>
					Alle Nachrichten als gelesen markieren
				</button>
				<button 
					className='border_button md dark'
					onClick={() => deleteAllMessages()}
					disabled={loading}
				>
					Alle Nachrichten löschen
				</button>
			</div>
		);
	}, [loading]);
    
	return (
		<>
			<SiteHeader 
				isSubHeader
				siteHeaderContent={siteHeaderContent}
				// siteHeaderButtons={siteHeaderButtons}
			/>
			<div className={clsx('site_content',styles.user_messages_container)}>
				{!messageContent.length && <div><p>Gegenwärtig keine neuen Nachrichten vorhanden</p></div>}
				{sortArrayForDivider(messageContent, 'createdAt').map((message: DashboardTypes.MessageContent & {divider?:boolean}, index: number) => (
					<UserMessage
						key={message.objectId}
						message={message}
						deleteMessageHandler={deleteMessageHandler}
						setMessageToRead={setMessageToRead}
						showDivider={ index === 0 || message.divider ||  false}
					/>
				))}
			</div>
		</>
	);
};

export default UserMessages;