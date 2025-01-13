import { useMemo } from 'react';

const useUserManagementNavigation = () => {
	
	const siteStates = useMemo(()=> {
		const siteStateArray = [
			{
				value: 'overview',
				label: 'Überblick'
			},
			{
				value: 'facility_management',
				label: 'Hausverwaltungen',
				disabled: true
			},
			{
				value: 'user_portals',
				label: 'Nutzerportale',
				disabled: true
			}
		];
		
		return siteStateArray;
	}, []);

	return siteStates;
};


export default useUserManagementNavigation;