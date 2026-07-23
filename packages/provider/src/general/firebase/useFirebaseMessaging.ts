"use client";

import { useCallback, useEffect, useState } from "react";
import { MessagePayload, onMessage } from "firebase/messaging";

import { messaging, requestPermissionAndGetToken } from "./initializeFirebase";
import { saveNotification } from "../functions";
import { NotificationData } from "@repo/types";

const useFirebaseMessaging = ({
	initialize = true,
	changeHandler
}: {
	initialize?: boolean;
	changeHandler?: (n: MessagePayload) => void;
}) => {
	const [permission, setPermission] = useState<
		"granted" | "denied" | "default" | undefined
	>();
	const [token, setToken] = useState<string | null>(null);

	const getToken = useCallback(async () => {
		const nextToken = await requestPermissionAndGetToken();
		setToken(nextToken);
		if (typeof Notification !== "undefined") {
			setPermission(Notification.permission);
		}
		return nextToken;
	}, []);

	useEffect(() => {
		if (!initialize) {
			return;
		}

		let unsubscribe: (() => void) | undefined;

		const setupMessaging = async () => {
			const nextToken = await getToken();
			if (!nextToken || !messaging) {
				return;
			}

			unsubscribe = onMessage(messaging, (payload) => {
				if (payload.notification) {
					saveNotification({
						title: payload.notification.title as string,
						body: payload.notification.body as string,
						timestamp: new Date().toISOString(),
						read: false,
						id: payload.messageId,
						image: (payload.notification.image ||
							payload.notification.icon) as string,
						data: payload.data as NotificationData
					});
				}
				changeHandler?.(payload);
			});
		};

		setupMessaging();

		return () => {
			unsubscribe?.();
		};
	}, [initialize, changeHandler, getToken]);

	return { permission, token, getFcmToken: getToken };
};

export default useFirebaseMessaging;
