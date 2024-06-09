'use client';

import React from 'react';
import { MessageTypes, UserTypes } from '@/types';

interface ContextValues {
    user: UserTypes.User,
    loginUser: ({ username, password }: { username: string; password: string; }) => Promise<void>,
    project: string,
    changeProject: (id: string) => void,
    getUserData: () => void,
    userMessages: MessageTypes.Message[],
    refetchMessages: () => void
}

const UserContext = React.createContext({} as ContextValues);

export default UserContext;
