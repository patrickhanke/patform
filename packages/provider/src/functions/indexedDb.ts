import { openDB } from 'idb';
import { Notification } from '@repo/types';

const dbName = 'notifications-database';
const storeName = 'notifications-store';


export const initDB = async () => {
	const dbVersion = 2;
	
	const db = await openDB(dbName, 2, {
		upgrade(db) {
			
			if (!db.objectStoreNames.contains(storeName)) {
				db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true  });
			}
		}
	});

	if (db.version !== dbVersion) {
		db.close();
		await openDB(dbName, dbVersion);
	}

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

export const deleteAllNotifications = async () => {
	const db = await initDB();
	const tx = db.transaction(storeName, 'readwrite');
	const store = tx.objectStore(storeName);
	await store.clear();
	await tx.done;
};
