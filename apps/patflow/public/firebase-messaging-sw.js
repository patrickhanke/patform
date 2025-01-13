self.importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
self.importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');


const firebaseConfig = {
	apiKey: 'AIzaSyARUPJePB7XFzxliXn8QoBFT79lnJ4u8Ko',
	authDomain: 'hgs-app-d35b1.firebaseapp.com',
	projectId: 'hgs-app-d35b1',
	storageBucket: 'hgs-app-d35b1.firebasestorage.app',
	messagingSenderId: '641842391250',
	appId: '1:641842391250:web:af88774f5d9e0aac01250b',
	measurementId: 'G-32QEKHD6FM'
};
// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
	console.log('[firebase-messaging-sw.js] Received background message: ', payload);

	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: payload.notification.icon
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
	// Save notification in local storage
	const request = indexedDB.open('notifications-database', 2);

	request.onsuccess = (event) => {
		const db = event.target.result;
		const transaction = db.transaction('notifications-store', 'readwrite');
		const store = transaction.objectStore('notifications-store');

		const notification = {
			title: payload.notification.title,
			body: payload.notification.body,
			image: payload.notification.icon,
			timestamp: new Date().toISOString(),
			read: false,
			data: payload.data,
			id: payload.messageId
		};

		store.add(notification);
	};

	request.onerror = (event) => {
		console.error('IndexedDB error:', event.target.errorCode);
	};
});