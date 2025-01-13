'use client';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { deleteNotification, getNotifications, UserContext } from '@repo/provider';
import { setNotificationsToRead as snr, Notification } from '@repo/provider';
import NotificationContext from './NotificationContext';
import useInstallations from './hooks/useInstallations';

import dynamic from 'next/dynamic';

const useFirebaseMessaging = dynamic(() => import('../../firebase/useFirebaseMessaging').then(mod => mod.default), { ssr: false });
 
const NotificationContextProvider = ({children} : {children: React.ReactNode}) => {
	const {user} = useContext(UserContext);
	const {token} = useFirebaseMessaging();
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
		setNotifications(notificationArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
		setUnreadNotifications(unreadNotificationArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
	}, [notifications, unreadNotifications]);

	const deleteNotificationCallaback = useCallback(async (id: number | string) => {
		await deleteNotification(id);
		await getNotificationCallback();
	}, [notifications]);

	useEffect(() => {
		const interval = setInterval(async () => {
			getNotificationCallback();
		}, 12000); 
	
		return () => clearInterval(interval);
	}, []);

	const setNotificationsToRead = useCallback(() => {
		setTimeout(async () => {
			await snr();
			getNotificationCallback();
		}, 2000);
	}, []);

	const notificationContextObject = useMemo(() => ({
		notifications,
		unreadNotifications,
		setNotificationsToRead,
		deleteNotification: deleteNotificationCallaback
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