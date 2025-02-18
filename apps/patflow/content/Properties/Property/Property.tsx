'use client';

import React, { use, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import useSiteStates from './constants/siteStates';
import { GET_PROPERTY } from '@queries';
import PropertyTasks from './content/PropertyTasks';
import PropertySettings from './content/PropertySettings';
import PropertyServices from './content/PropertyServices';
import PropertyTallies from './content/PropertyTallies';
import PropertyDocuments from './content/PropertyDocuments';
import PropertyTickets from './content/PropertyTickets';
import { Params, Property as PropertyType } from '@types';
import { Page, PageHeaderButton } from '@repo/ui';
import { set } from 'lodash';

const Property = ({params} : {params: Params}) => {
	const siteStates = useSiteStates();
	const [siteState, setSiteState] = useState<typeof siteStates[number]>(siteStates[0] as typeof siteStates[number]);
	const [addService, setAddService] = useState(false);
	
	const {data, refetch} = useQuery (
		GET_PROPERTY, 
		{
			variables: {id: params.object_id}, 
			fetchPolicy: 'no-cache'
		}
	);

	const siteContent = useMemo(() => {
		const content = {
			description: 'Objektübersicht'
		}
		if (siteState.value === 'tasks') {
			content.description = 'Aufgabenübersicht';
		}
		if (siteState.value === 'settings') {
			content.description = 'Einstellungen';
		}
		if (siteState.value === 'services') {
			content.description = 'Dienstleistungen';
		}
		if (siteState.value === 'tallies') {
			content.description = 'Zähler';
		}
		return content;
	}, [siteState]);

	const pageHeaderButtons: PageHeaderButton[] =  useMemo(() => {
		if (siteState.value === 'services') {
			return ([
				{
					text: 'Leistung hinzufügen',
					onClick: () => setAddService(true),
					is_add_button: true
				}
			] as PageHeaderButton[])
		}
		return [];
	
	}, [siteState]);

	if (!data) return null;

	const property: PropertyType = data.objects.getProperty;

	return (
		<Page 
			title={property.name}
			description={siteContent.description}
			refetch={refetch}
			pageStates={siteStates}
			pageState={siteState}
			setPageState={setSiteState}
			pageHeaderButtons={pageHeaderButtons}
		>
			{siteState.value === 'tasks' && 
				<PropertyTasks objectId={params.object_id}/>
			}
			{siteState.value === 'settings' && 
				<PropertySettings objectId={params.object_id}  />
			}
			{siteState.value === 'services' && 
				<PropertyServices objectId={params.object_id} addService={addService} setAddService={setAddService}  />
			}
			{siteState.value === 'tallies' && 
				<PropertyTallies objectId={params.object_id} />
			}
			{siteState.value === 'documents' && 
				<PropertyDocuments id={params.object_id} />
			}
			{siteState.value === 'tickets' && 
				<PropertyTickets id={params.object_id} />
			}
		</Page>
	);

};

export default Property;