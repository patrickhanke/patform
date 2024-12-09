'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import UserContext from './UserContext';
import { axiosclient, generateGraphQLQuery } from '@/provider';
import Cookies from 'js-cookie';
import useStorage from './hooks/useStorage';
import { useRouter } from 'next/navigation';
import { FIND_USER_MESSAGES } from '@/queries';
import { useQuery } from '@apollo/client';
import { User } from '@/types';

const UserContextProvider = ({ children }: {children: React.ReactNode}) => {
	const token = Cookies.get('hgs_token');
	const [user, setUser] = useState({} as User);
	// const [project, setProject] = useState('');
	const {getItem, setItem} = useStorage();

	const {data: messageData, refetch} = useQuery(FIND_USER_MESSAGES, {
		variables: {
			params: {user: {_eq: user?.objectId}}
		},
		pollInterval: 10000,
		skip: !user
	});

	const router = useRouter();

	const userMessages = useMemo(() => {
		if (messageData) {
			return messageData.objects.findMessage.results;
		}
		return [];
	}, [messageData]);

	// get user
	const loginUser = async ({username, password}: {username: string, password: string}) => {
		await axiosclient().post('login', {
			'username': username, 
			'password': password
		})
			.then(response => {
				Cookies.set('hgs_token', response.data.sessionToken, {expires: 90});
				setItem( 'user', response.data, 'session', 'object' );
				setItem( 'project', response.data.project.objectId, 'session' );
				router.push('/');
			})
		
			.catch(error => {
				if (error.message === 'Invalid username/password.') {
					window.alert('Falsche E-Mail / Passwort Kombination');
				} else {
					window.alert('Das Einloggen ist leider fehlgeschlagen');
				}
			});
	};

	const changeProject = (id: string) => {
		setItem( 'project', id, 'session' );
		window.location.reload();
	};

	const getUserData =  useCallback( async () => {
		axiosclient().get('/users/me')
			.then(response => {
				setItem( 'user', response.data, 'session' );
				setItem( 'project', response.data.project.objectId, 'session' );
				setUser(response.data);
			})
			.catch(error => console.error(error.message));
	}, [getItem('user', 'session', 'object')]);

	const {data: projectData} = useQuery(
		generateGraphQLQuery({
			type: 'get', 
			objectName: 'Project', 
			fields: ['objectId', 'name', 'time_settings', 'record_settings']
		}), {
			variables: {id: getItem('project', 'session')}
		});

	const userContextObject = useMemo(() => ({
		user, 
		loginUser,
		project: projectData?.objects.getProject,
		changeProject,
		getUserData,
		userMessages,
		refetchMessages: refetch
	}), [token, user, userMessages, messageData, projectData]);

	useEffect(() => {
		if (token && !getItem('user', 'session', 'object') ) {
			getUserData();
		}
	}, []);

	useEffect(() => {
		if (!user) {
			setUser(getItem('user', 'session', 'object') as User);
		}
	}, [user, token]);

	return (
		<UserContext.Provider
			value={userContextObject}
		>
			{children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
