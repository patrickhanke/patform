import styles from './MessageIndicator.module.scss';
import { Message } from '@repo/types';

const MessageIndicator = ({messages = []}: {messages: Message[]}) => {
	const newMessages = messages.filter(message => !message.is_read);

	if (newMessages && newMessages.length > 0) return (
		<div className={styles.message_indicator}>{newMessages.length}</div>
	);

	return null;
};

export default MessageIndicator;