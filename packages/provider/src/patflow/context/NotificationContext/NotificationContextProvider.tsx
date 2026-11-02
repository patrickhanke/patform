"use client";

import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";
import {
	deleteNotification,
	getNotifications,
	useFirebaseMessaging
} from "@repo/provider";
import { setNotificationsToRead as snr } from "@repo/provider";
import NotificationContext from "./NotificationContext";
import useInstallations from "./hooks/useInstallations";
import { MessagePayload } from "firebase/messaging";
import { isEqual } from "lodash-es";
import { Notification } from "@repo/types";
import { UserContext } from "../UserContext";

const sortNotifications = (items: Notification[]) =>
	[...items].sort(
		(a, b) =>
			new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
	);

const partitionNotifications = (data: Notification[]) => {
	const notificationArray: Notification[] = [];
	const unreadNotificationArray: Notification[] = [];

	data.forEach((notification) => {
		notificationArray.push(notification);
		if (!notification.read) {
			unreadNotificationArray.push(notification);
		}
	});

	return {
		all: sortNotifications(notificationArray),
		unread: sortNotifications(unreadNotificationArray)
	};
};

const NotificationContextProvider = ({
	children
}: {
	children: React.ReactNode;
}) => {
	const { user } = useContext(UserContext);
	const [newNotification, setNewNotification] = useState<string | undefined>(
		undefined
	);

	const messageChangeHanlder = useCallback((notification: MessagePayload) => {
		if (!notification?.messageId) {
			return;
		}
		setNewNotification((current) =>
			current !== notification.messageId ? notification.messageId : current
		);
	}, []);

	const { token } = useFirebaseMessaging({
		initialize: true,
		changeHandler: messageChangeHanlder
	});

	useInstallations({
		user,
		firebaseToken: token
	});

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadNotifications, setUnreadNotifications] = useState<
		Notification[]
	>([]);

	const notificationsRef = useRef(notifications);
	const unreadNotificationsRef = useRef(unreadNotifications);
	notificationsRef.current = notifications;
	unreadNotificationsRef.current = unreadNotifications;

	const getNotificationCallback = useCallback(async () => {
		const data: Notification[] = await getNotifications();
		const { all, unread } = partitionNotifications(data);

		if (!isEqual(notificationsRef.current, all)) {
			setNotifications(all);
		}
		if (!isEqual(unreadNotificationsRef.current, unread)) {
			setUnreadNotifications(unread);
		}
	}, []);

	const deleteNotificationCallaback = useCallback(
		async (id: number | string) => {
			await deleteNotification(id);
			await getNotificationCallback();
		},
		[getNotificationCallback]
	);

	useEffect(() => {
		void getNotificationCallback();

		const interval = setInterval(() => {
			void getNotificationCallback();
		}, 24000);

		return () => clearInterval(interval);
	}, [getNotificationCallback]);

	const setNotificationsToRead = useCallback(() => {
		setTimeout(async () => {
			await snr();
			await getNotificationCallback();
		}, 2000);
	}, [getNotificationCallback]);

	const notificationContextObject = useMemo(
		() => ({
			newNotification,
			notifications,
			unreadNotifications,
			setNotificationsToRead,
			deleteNotification: deleteNotificationCallaback,
			reloadNotifications: getNotificationCallback
		}),
		[
			newNotification,
			notifications,
			unreadNotifications,
			setNotificationsToRead,
			deleteNotificationCallaback,
			getNotificationCallback
		]
	);

	return (
		<NotificationContext.Provider value={notificationContextObject}>
			{children}
		</NotificationContext.Provider>
	);
};

export default NotificationContextProvider;
