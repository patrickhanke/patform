'use client';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { deleteNotification, getNotifications, useFirebaseMessaging, UserContext } from '@repo/provider';
import { setNotificationsToRead as snr, Notification } from '@repo/provider';
import NotificationContext from './NotificationContext';
import useInstallations from './hooks/useInstallations';
import { MessagePayload } from 'firebase/messaging';
import { isEqual } from 'lodash-es';
 
const NotificationContextProvider = ({children} : {children: React.ReactNode}) => {
	console.log('NotificationContextProvider');
	
	const {user} = useContext(UserContext);
	const [newNotification, setNewNotification] = useState<string | undefined>(undefined);
	
	const messageChangeHanlder = useCallback((notification: MessagePayload) => {
		
		if (notification?.messageId && (newNotification !== notification.messageId)) {
			setNewNotification(notification.messageId);
		}
	}, [newNotification]);
	
	const {token} = useFirebaseMessaging({
		initialize: true, 
		changeHandler: messageChangeHanlder
	});

	useInstallations({
		user, 
		firebaseToken: token, 
		hasInstallation: true
	});

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);

	const getNotificationCallback = useCallback(async () => {
		const data: Notification[] = await getNotifications();
		const notificationArray: Notification[] = [];
		const unreadNotificationArray: Notification[] = [];
		data.forEach((notification) => {
			if (!notification.read) {
				notificationArray.push(notification);
				unreadNotificationArray.push(notification);
			} else {
				notificationArray.push(notification);
			}
		});
		if (!isEqual(notifications, notificationArray)) {
			setNotifications(notificationArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
		}
		if (!isEqual(unreadNotifications, unreadNotificationArray)) {
			setUnreadNotifications(unreadNotificationArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
		}
	}, [notifications, unreadNotifications]);

	const deleteNotificationCallaback = useCallback(async (id: number | string) => {
		await deleteNotification(id);
		await getNotificationCallback();
	}, [notifications]);

	useEffect(() => {
		const interval = setInterval(async () => {
			getNotificationCallback();
		}, 24000); 
	
		return () => clearInterval(interval);
	}, []);

	const setNotificationsToRead = useCallback(() => {
		setTimeout(async () => {
			await snr();
			getNotificationCallback();
		}, 2000);
	}, []);

	const notificationContextObject = useMemo(() => ({
		newNotification,
		notifications,
		unreadNotifications,
		setNotificationsToRead,
		deleteNotification: deleteNotificationCallaback,
		reloadNotifications: getNotificationCallback
	}), [notifications, unreadNotifications]);
	
	return (
		<NotificationContext.Provider
			value={notificationContextObject}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export default NotificationContextProvider;