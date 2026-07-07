"use client";

import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken, Messaging } from "firebase/messaging";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID,
	vapidKey:
		"BJ3Q1Q-9N4W_xpbR4BVTLqEkwKMuuXC7lhl4yGleDnRQrwLML7dTM7uktXmb2a5o9U-R1o9-Xa_hNrKKaB-ROds",
};

const isFirebaseConfigured = Boolean(
	firebaseConfig.apiKey &&
		firebaseConfig.projectId &&
		firebaseConfig.appId
);

export let messaging: Messaging | undefined;

let app: FirebaseApp | undefined;

if (isFirebaseConfigured) {
	app = initializeApp(firebaseConfig);

	if (typeof window !== "undefined" && "serviceWorker" in navigator) {
		messaging = getMessaging(app);
	}
} else if (process.env.NODE_ENV !== "production") {
	console.warn(
		"Firebase is not configured (missing FIREBASE_API_KEY, FIREBASE_PROJECT_ID, or FIREBASE_APP_ID)."
	);
}

export const requestPermissionAndGetToken = async () => {
	if (!messaging) {
		return null;
	}

	try {
		await Notification.requestPermission();

		const token = await getToken(messaging, {
			vapidKey: firebaseConfig.vapidKey,
		});

		return token;
	} catch (err) {
		console.error("Error getting messaging token:", err);
		return null;
	}
};
