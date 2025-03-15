'use client';

import { ApolloAppProvider, AppContextProvider } from '@provider';
import {
    UserContextProvider,
    NotificationContextProvider,
} from '@repo/provider';
import React from 'react';

const LayoutContext = ({ children }: { children: React.ReactNode }) => {
    return (
        <ApolloAppProvider>
            <UserContextProvider>
                <AppContextProvider>
                    <NotificationContextProvider>
                        <React.StrictMode>{children}</React.StrictMode>
                    </NotificationContextProvider>
                </AppContextProvider>
            </UserContextProvider>
        </ApolloAppProvider>
    );
};

export default LayoutContext;
