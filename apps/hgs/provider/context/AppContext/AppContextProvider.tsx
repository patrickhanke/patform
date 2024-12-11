'use client';

import React, { useMemo, useState } from 'react';
import AppContext from './AppContext';
import SelectYear from './components/SelectYear';
import { useQuery } from '@apollo/client';
import { FIND_ALL_ROLES } from '@queries';
import { RoleUsers } from './types';
import { UserRole } from '@repo/types';
import { CreateTask, CreateTicket } from '@content';

const AppContextProvider = ({children} : {children: React.ReactNode}) => {
	const [refetchFunction, setRefetchFunction] = useState();
	const [year, setYear] = useState(new Date().getFullYear());
	const {data: roleData} = useQuery(FIND_ALL_ROLES, {fetchPolicy: 'cache-first'}); 
	
	const roleUsers = useMemo(() => {
		const roleObject: RoleUsers = {
			worker: [],
			office: [],
			admin: []
		} ;
		
		if (roleData) {
			roleData.objects.find_Role.results.forEach((role: UserRole) => {
				roleObject[role.type] = role.users.results.map(user => user.objectId);
			});
		}

		return roleObject;
	}, [roleData]);

	const appContextObject = useMemo(() => ({
		refetchFunction,
		setRefetchFunction,
		createTicket: <CreateTicket refetch={refetchFunction} />,
		createTask: <CreateTask refetch={refetchFunction} />,
		selectYear: <SelectYear year={year} setYear={setYear} />,
		year,
		roles: roleData ? roleData.objects.find_Role.results.map((role: UserRole) => ({value: role.objectId, type: role.type, label: role.name, color: role.color, users: role.users.results})) : [],
		roleUsers
	}), [refetchFunction, roleUsers, year, roleData]);
	
	return (
		<AppContext.Provider
			value={appContextObject}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;