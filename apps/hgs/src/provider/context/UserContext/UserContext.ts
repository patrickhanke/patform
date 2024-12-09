'use client';

import React from 'react';
import { Message, Project, User } from '@/types';

interface ContextValues {
    user: User,
    loginUser: ({ username, password }: { username: string; password: string; }) => Promise<void>,
    project: Project,
    changeProject: (id: string) => void,
    getUserData: () => void,
    userMessages: Message[],
    refetchMessages: () => void
}

const UserContext = React.createContext({} as ContextValues);

export default UserContext;
