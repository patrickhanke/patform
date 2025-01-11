'use client';

import { Notification } from '@repo/provider';
import React from 'react';

interface ContextValues {
    notifications: Notification[],
    unreadNotifications: Notification[],
    setNotificationsToRead: () => void,
    deleteNotification: (id: number | string) => void
}

const NotificationContext = React.createContext({} as ContextValues );

export default NotificationContext;