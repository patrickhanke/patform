import { MessageTypes } from '@/types';
import React from 'react';
import styles from './MessageIndicator.module.scss';

const MessageIndicator = ({messages = []}: {messages: MessageTypes.Message[]}) => {
	const newMessages = messages.filter(message => !message.is_read);

	if (newMessages && newMessages.length > 0) return (
		<div className={styles.message_indicator}>{newMessages.length}</div>
	);

	return null;
};

export default MessageIndicator;