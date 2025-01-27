import { useMemo } from 'react';

const useUserManagementNavigation = () => {
	
	const siteStates = useMemo(()=> {
		const siteStateArray = [
			{
				value: 'overview',
				label: 'Überblick',
				enableSorting: false
			},
			{
				value: 'facility_management',
				label: 'Hausverwaltungen',
				disabled: true,
				enableSorting: false
			},
			{
				value: 'user_portals',
				label: 'Nutzerportale',
				disabled: true,
				enableSorting: false
			}
		];
		
		return siteStateArray;
	}, []);

	return siteStates;
};

export default useUserManagementNavigation;