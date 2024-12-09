'use client';

import { Tickets } from '@/_UI';
import SiteHeader from '@/_UI/surfaces/SiteHeader';
import React, { Suspense, useState } from 'react';
import site_states from './constants/site_states';

const TicketsOverview = () => {
	const [siteState, setSiteState] = useState<typeof site_states[0]>(site_states[0]);

	return (
		<>
			<SiteHeader
				title='Tickets'
				navItems={site_states} 
				navCurrentItem={siteState} 
				navOnClick={setSiteState}
				hasSiteNavigation
			/>
			<Suspense>
				<Tickets siteType={siteState.value as 'open' | 'in_progress' | 'closed'}  />
			</Suspense>
		</>
	);
};

export default TicketsOverview;