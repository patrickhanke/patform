'use client';

import { Tickets } from '@content';
import React, { Suspense, useState } from 'react';
import site_states from './constants/site_states';
import { SiteHeader } from '@repo/ui';

const TicketsOverview = () => {
	const [siteState, setSiteState] = useState<typeof site_states[0]>(site_states[0]);

	return (
		<Suspense>
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
		</Suspense>
	);
};

export default TicketsOverview;