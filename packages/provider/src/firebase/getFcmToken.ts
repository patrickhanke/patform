'use client';

import { getToken, Messaging } from 'firebase/messaging';

const getFcmToken: (messaging: Messaging) => Promise<string | void> = async (messaging) => {
	// await navigator.serviceWorker.register('/firebase-messaging-sw.js')
	// 	.then((registration) => {
	// 		console.log('Service Worker registered with scope:', registration.scope);
	// 		return registration;
	// 	})
	// 	.catch((error) => {
	// 		console.error('Service Worker registration failed:', error);
	// 	});
	
	try {
		const vapidKey = 'BJ3Q1Q-9N4W_xpbR4BVTLqEkwKMuuXC7lhl4yGleDnRQrwLML7dTM7uktXmb2a5o9U-R1o9-Xa_hNrKKaB-ROds'; // Replace with your Firebase project's VAPID key
		const token = await getToken(messaging, { vapidKey });
		if (token) {
			console.log('FCM Token:', token);
			return token;
			// Save the token to your backend for later use
		} else {
			console.log('No registration token available.');
		}
	} catch (error) {
		console.error('Error getting token:', error);
	}
};

export default getFcmToken;