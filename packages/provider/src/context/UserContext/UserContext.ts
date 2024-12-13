'use client';

import React from 'react';
import { Message, User } from '@repo/types';

interface ContextValues {
    user: User,
    projectId: string,
    changeProject: (id: string) => void,
    getUserData: () => void,
    userMessages: Message[],
    refetchMessages: () => void
}

const UserContext = React.createContext({} as ContextValues);

export default UserContext;
