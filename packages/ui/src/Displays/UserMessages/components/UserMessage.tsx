import React from 'react';
import styles from '../UserMessage.module.scss';
import { DashboardTypes } from '@types';
import { Divider, IconButton } from '@repo/ui';

const UserMessage = ({message, showDivider=false, deleteMessageHandler, setMessageToRead}: DashboardTypes.UserMessageProps) => {
	return (
		<>
			{showDivider && <Divider date={message.createdAt} />}
			<div className={styles.user_message_container}> 
				<div className={styles.content_container}>
					<div className={styles.user_message_icon}></div>
					<div className={styles.user_message_content}>
						<div className={styles.user_message_headline} data-is_read={message.is_read}>
							<h3>
								{message.headline}
								<span className={styles.time}>{message.time}</span>
							</h3>
						</div>
						<div className={styles.user_message_text} data-is_read={message.is_read}>
							<p>{message.content}</p>
						</div>
					</div>
				</div>
				<div className='button_container'>
					<IconButton icon='link' isLink link={message.link} />
					<IconButton icon='delete' onClick={() => deleteMessageHandler(message.objectId)} />
					<IconButton icon='check' onClick={() => setMessageToRead(message.objectId)} />
				</div>
			</div>
		</>
	);
};

export default UserMessage;