'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import useSiteStates from './constants/siteStates';
import { GET_PROPERTY } from '@queries';
import PropertyTasks from './content/PropertyTasks';
import PropertySettings from './content/PropertySettings';
import PropertyServices from './content/PropertyServices';
import PropertyTallies from './content/PropertyTallies';
import PropertyDocuments from './content/PropertyDocuments';
import PropertyTickets from './content/PropertyTickets';
import { Params } from '@types';
import { SiteHeader } from '@repo/ui';

const Property = ({params} : {params: Params}) => {
	const {data} = useQuery (
		GET_PROPERTY, 
		{
			variables: {id: params.object_id}, 
			fetchPolicy: 'no-cache'
		}
	);
	const siteStates = useSiteStates();
	const [siteState, setSiteState] = useState<typeof siteStates[number]>(siteStates[0] as typeof siteStates[number]);

	return (
		<>
			<SiteHeader
				title={data && data.objects.getProperty.name}
				hasSiteNavigation
				navItems={siteStates} 
				navCurrentItem={siteState} 
				navOnClick={setSiteState}
			/>

			{siteState.value === 'tasks' && 
				<PropertyTasks objectId={params.object_id}/>
			}
			{siteState.value === 'settings' && 
				<PropertySettings objectId={params.object_id}  />
			}
			{siteState.value === 'services' && 
				<PropertyServices objectId={params.object_id}  />
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
		</>
	);

};

export default Property;