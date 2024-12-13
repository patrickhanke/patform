'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import UserContext from './UserContext';
import { axiosclient } from '@repo/provider';
import Cookies from 'js-cookie';
import {User} from '@repo/types';
import { useQuery } from '@apollo/client';
import find_user_messages from './constants/find_user_messages';
import { useSessionStorage } from 'usehooks-ts';

const UserContextProvider = ({ children }: {children: React.ReactNode}) => {
	console.log(process.env.SESSION_TOKEN);
	
	const token = Cookies.get(process.env.SESSION_TOKEN);
	const [project, setProject, removeProject] = useSessionStorage<string | undefined>('project', undefined, {initializeWithValue: true});
	const [user, setUser, removeUser] = useSessionStorage<User | undefined>('user', undefined, {initializeWithValue: true});

	console.log({project});
	console.log({user});
	console.log({token});
	

	const {data: messageData, refetch} = useQuery(find_user_messages, {
		variables: {
			params: {user: {_eq: user?.objectId}}
		},
		pollInterval: 10000,
		skip: !user
	});

	const userMessages = useMemo(() => {
		if (messageData) {
			return messageData.objects.findMessage.results;
		}
		return [];
	}, [messageData]);

	const changeProject = (id: string) => {
		setProject( id );
		window.location.reload();
	};

	const getUserData =  useCallback( async () => {
		console.log('effect');
		axiosclient().get('/users/me')
			.then(response => {
				console.log(response.data);
				setUser( response.data );
				setProject(response.data.project.objectId);
			})
			.catch(error => console.error(error.message));
	}, []);

	const userContextObject = useMemo(() => ({
		user: user as User, 
		projectId: project || '',
		changeProject,
		getUserData,
		userMessages,
		refetchMessages: refetch
	}), [token, user]);

	useEffect(() => {
		if (token && !user) {
			getUserData();
		}
	}, []);

	return (
		<UserContext.Provider
			value={userContextObject}
		>
			{children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
