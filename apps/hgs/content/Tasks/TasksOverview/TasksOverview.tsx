'use client';

import { Tasks } from '@content';
import { TasksComponent } from '@content';
import React, { Suspense, useState } from 'react';
import site_states from './constants/site_states';
import { SiteHeader } from '@repo/ui';

const TasksOverview = () => {
	const [siteState, setSiteState] = useState<typeof site_states[number]>(site_states[0] as typeof site_states[0]);

	return (
		
			<Suspense>
				<Tasks 
					siteType={siteState.value as TasksComponent['siteType']}  
					siteStates={site_states}
				/>
			</Suspense>
	);
};

export default TasksOverview;