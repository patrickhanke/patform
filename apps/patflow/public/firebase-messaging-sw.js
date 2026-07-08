self.importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js",
);
self.importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

console.log("fb messaging");

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message: ",
    payload,
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  // Save notification in local storage
  const request = indexedDB.open("notifications-database", 2);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction("notifications-store", "readwrite");
    const store = transaction.objectStore("notifications-store");

    const notification = {
      title: payload.notification.title,
      body: payload.notification.body,
      image: payload.notification.icon,
      timestamp: new Date().toISOString(),
      read: false,
      data: payload.data,
    };

    store.add(notification);
  };

  request.onerror = (event) => {
    console.error("IndexedDB error:", event.target.errorCode);
  };
});
