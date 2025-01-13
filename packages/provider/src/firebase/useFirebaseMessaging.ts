'use client';

import { useCallback, useEffect, useState } from 'react';
import { onMessage } from 'firebase/messaging';
import messaging from './initializeFirebase';
import requestPermission from './requestPermission';
import getFcmToken from './getFcmToken';
import { saveNotification } from '../functions';

const useFirebaseMessaging = () => {
	const [permission, setPermission] = useState<'granted' | 'denied' | 'error' | undefined>();
	const [token, setToken] = useState<string | null>(null);

	const getPermission = useCallback(async () => {
		const pm = await requestPermission();
		setPermission(pm);
	}, []);

	const getToken = useCallback(async () => {
		const currentToken = await getFcmToken(messaging);
       
		if (currentToken) {
			setToken(currentToken);
		}
	}, [messaging]);
    
	useEffect(() => {
		if (!messaging) return console.error('Firebase Messaging not initialized');
		if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
			navigator.serviceWorker
				.register('/firebase-messaging-sw.js')
				.then((registration) => {
					customLog('Service Worker registered with scope:', registration.scope);
				})
				.catch((error) => {
					customLog('Service Worker registration failed:', error);
				});
		}
		
		const customLog = (...args: any[]) => {
			if (process.env.NODE_ENV !== 'production') {
				console.log(...args);
			}
		};
		if (!permission ) {
			getPermission();
		}

		if (!token) {
			getToken();
		}

		if (permission === 'granted' && token) {
			const unsubscribe = onMessage(messaging, (payload) => {
				if (payload.notification) {
					saveNotification({
						title: payload.notification.title as string,
						body: payload.notification.body as string,
						timestamp: new Date().toISOString(),
						read: false,
						id: payload.messageId,
						image: payload.notification.image as string,
						data: payload.data
					});
				}
			});
			return () => {
				unsubscribe(); // Unsubscribe from the onMessage event on cleanup
			};
		}
	}, [permission, messaging, token]);

	return ({permission, token});
};

export default useFirebaseMessaging;