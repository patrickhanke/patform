import styles from '../UserMessage.module.scss';
import clsx from 'clsx';
import { IconButton, StateDisplay } from '@repo/ui';
import { NotificationStateDisplay, RenderNotificationProps } from '../types';
import { axiosclient, getDateStringsFromIso } from '@repo/provider';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import createLabelLinks from '../functions/createLabelLinks';

const RenderNotification: FC<RenderNotificationProps> = ({title, body, timestamp, read, id, deleteNotification, data}) => {
	const [link, setLink]  = useState<string | null>(null);
	
	const stateDisplay: (NotificationStateDisplay | null) = useMemo(() => {
		if (!data) return null;

		return ({
			label: data.type === 'ticket' ? 'Ticket' : 'Task',
			color: data.type === 'ticket' ? 'blue' : 'green',
			icon: data.type === 'ticket' ? 'ticket' : 'task',
			link: createLabelLinks(data)
		});
	}, []);

	const linkHandler = useCallback(async () => {
		let linkString = 'no_link';

		if (data && data.type === 'task') {
			await axiosclient().post('/functions/get-task-link', {id: data.id})
				.then(response => {
					linkString = response.data.result?.link;
				})
				.catch(() => {
					linkString = 'no_link';
				});
		}

		if (data && data.type === 'ticket') {
			await axiosclient().post('/functions/get-ticket-link', {id: data.id})
				.then(response => {
					linkString = response.data.result?.link;
				})
				.catch(() => {
					linkString = 'no_link';
				});
		}

		if (linkString) {
			setLink(linkString);
		} 
		
	}, [data]);

	useEffect(() => {
		if (data && (data.type === 'task' || data.type === 'ticket') && link === null) {
			linkHandler();
		}
	}, [data, link]);
	
	return (
		<div className={clsx(styles.user_message_container)} data-is_read={read}> 
			<div className={styles.content_container}>
				<div className={styles.user_message_content}>
					<div className={styles.user_message_headline} data-is_read={read}>
						<div className={styles.user_message_header} >
							<h3>
								{title}
								{timestamp && <span className={styles.time}>{`/ ${getDateStringsFromIso(new Date(timestamp)).dateTime}`}</span>}
							</h3>
							{link && link !== 'no_link' && <span>
								<IconButton icon='link' isLink link={link} />
							</span>}
						</div>
						<IconButton icon='close' size={12} onClick={() => deleteNotification(id)} />
					</div>
					<div className={styles.user_message_footer}>
						<div className={styles.user_message_text}>
							<div dangerouslySetInnerHTML={{__html: body}} />
						</div>
						{stateDisplay && (
							<StateDisplay
								label={stateDisplay.label}
								color={stateDisplay.color}
								icon={stateDisplay.icon}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RenderNotification;