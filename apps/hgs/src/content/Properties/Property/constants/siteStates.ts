import { useMemo } from 'react';

const useSiteStates = () => {
	
	const siteStates = useMemo(()=> {
		const siteStateArray = [
			{
				value: 'tasks',
				label: 'Aufgaben'
			}, 
			{
				value: 'services',
				label: 'Leistungsverzeichnis'
			},
			{
				value: 'tallies',
				label: 'Zähler'
			}, 
			{
				value: 'tickets',
				label: 'Tickets'
			},
			{
				value: 'documents',
				label: 'Dokumente'
			},
			{
				value: 'settings',
				label: 'Einstellungen'
			}
		];
		
		return siteStateArray;
	}, []);

	return siteStates;
};


export default useSiteStates;