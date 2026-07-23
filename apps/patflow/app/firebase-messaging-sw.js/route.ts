import { NextResponse } from "next/server";

const FIREBASE_SW_VERSION = "11.1.0";

function buildFirebaseMessagingServiceWorker() {
	const firebaseConfig = {
		apiKey: process.env.FIREBASE_API_KEY,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN,
		projectId: process.env.FIREBASE_PROJECT_ID,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.FIREBASE_APP_ID,
		measurementId: process.env.FIREBASE_MEASUREMENT_ID,
	};

	const configJson = JSON.stringify(firebaseConfig);

	return `self.importScripts(
  "https://www.gstatic.com/firebasejs/${FIREBASE_SW_VERSION}/firebase-app-compat.js",
);
self.importScripts(
  "https://www.gstatic.com/firebasejs/${FIREBASE_SW_VERSION}/firebase-messaging-compat.js",
);

const firebaseConfig = ${configJson};

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const notification = payload.notification || {};
    const notificationTitle = notification.title || "Neue Nachricht";
    const notificationOptions = {
      body: notification.body,
      icon: notification.icon || notification.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);

    const request = indexedDB.open("notifications-database", 2);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("notifications-store")) {
        db.createObjectStore("notifications-store", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("notifications-store", "readwrite");
      const store = transaction.objectStore("notifications-store");

      store.add({
        title: notification.title,
        body: notification.body,
        image: notification.icon || notification.image,
        timestamp: new Date().toISOString(),
        read: false,
        data: payload.data,
      });
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.errorCode);
    };
  });
}
`;
}

export async function GET() {
	return new NextResponse(buildFirebaseMessagingServiceWorker(), {
		headers: {
			"Content-Type": "application/javascript; charset=utf-8",
			"Cache-Control": "no-cache, no-store, must-revalidate",
			"Service-Worker-Allowed": "/",
		},
	});
}
