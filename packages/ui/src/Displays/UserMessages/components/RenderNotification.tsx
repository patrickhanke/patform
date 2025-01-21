import styles from '../UserMessage.module.scss';
import clsx from 'clsx';
import { IconButton } from '@repo/ui';
import { RenderNotificationProps } from '../types';
import { getDateStringsFromIso } from '@repo/provider';
import { FC } from 'react';

const RenderNotification: FC<RenderNotificationProps> = ({title, body, timestamp, read, id, deleteNotification}) => {
	
	return (
		<div className={clsx(styles.user_message_container)} data-is_read={read}> 
			<div className={styles.content_container}>
				<div className={styles.user_message_content}>
					<div className={styles.user_message_headline} data-is_read={read}>
						<div>
							<h3>
								{title}
								{timestamp && <span className={styles.time}>{`/ ${getDateStringsFromIso(new Date(timestamp)).dateTime}`}</span>}
							</h3>
						</div>
						<IconButton icon='close' size={10} onClick={() => deleteNotification(id)} />
					</div>
					<div className={styles.user_message_text}>
						<div dangerouslySetInnerHTML={{__html: body}} />
					</div>
				</div>
			</div>
			{/* <div className='button_container'>
				<IconButton icon='link' isLink link={message.link} />
				<IconButton icon='delete' onClick={() => deleteMessageHandler(message.objectId)} />
				<IconButton icon='check' onClick={() => setMessageToRead(message.objectId)} />
			</div> */}
		</div>
	);
};

export default RenderNotification;