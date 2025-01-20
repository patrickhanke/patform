import { openDB } from 'idb';
import { Notification } from '@repo/types';

const dbName = 'notifications-database';
const storeName = 'notifications-store';


export const initDB = async () => {
	const db = await openDB(dbName, 2);
	const version = db.version;
	console.log(db);
	console.log(db.objectStoreNames);
	console.log(db.objectStoreNames.contains(storeName));
	
	if (db.objectStoreNames.contains(storeName)) {

		return db;
	}
	await openDB(dbName, 3, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(storeName)) {
				db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
				// store.createIndex('title', 'title', { unique: false });
				// store.createIndex('body', 'body', { unique: false });
				// store.createIndex('image', 'image', { unique: false });
				// store.createIndex('timestamp', 'timestamp', { unique: false });
				// store.createIndex('read', 'read', { unique: false });
				// store.createIndex('data', 'data', { unique: false });
			}
		}
	});

	console.log(db);
	
    
	return db;
};

export const saveNotification = async (notification: Notification) => {
	const db = await initDB();
	const tx = db.transaction(storeName, 'readwrite');
	const store = tx.objectStore(storeName);
	await store.add(notification);
	const notifications = await store.getAll();
	if (notifications.length > 30) {
		const oldestNotification = notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
		await store.delete(oldestNotification.id);
	}
	await tx.done;
};

export const getNotifications: () => Promise<Notification[]> = async () => {
	const db = await initDB();
	const tx = db.transaction(storeName, 'readonly');
	const store = tx.objectStore(storeName);
	const values = await store.getAll() || [];
	await tx.done;
	return values;
};

export const setNotificationsToRead = async () => {
	const db = await initDB();
	const tx = db.transaction(storeName, 'readwrite');
	const store = tx.objectStore(storeName);
	const notifications = await store.getAll();
	notifications.forEach(async (notification) => {
		notification.read = true;
		await store.put(notification);
	});
	await tx.done;
};

export const deleteNotification = async (id: number | string) => {
	const db = await initDB();
	const tx = db.transaction(storeName, 'readwrite');
	const store = tx.objectStore(storeName);
	await store.delete(id);
	await tx.done;
};
