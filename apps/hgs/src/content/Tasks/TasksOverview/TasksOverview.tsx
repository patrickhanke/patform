'use client';

import { Tasks } from '@/content/_UI';
import SiteHeader from '@/_UI/surfaces/SiteHeader';
import { TasksComponent } from '@/content/_UI';
import React, { Suspense, useState } from 'react';
import site_states from './constants/site_states';

const TasksOverview = () => {
	const [siteState, setSiteState] = useState<typeof site_states[0]>(site_states[0]);

	return (
		<>
			<SiteHeader
				title='Aufgaben'
				navItems={site_states} 
				navCurrentItem={siteState} 
				navOnClick={setSiteState}
				hasSiteNavigation
			/>
			<Suspense>
				<Tasks siteType={siteState.value as TasksComponent['siteType']}  />
			</Suspense>
		</>
	);
};

export default TasksOverview;