'use client';

import React, { useState } from 'react';
import UserOverview from './content/UserOverview';
import useUserManagementNavigation from './hooks/useUserManagementNavigation';
import { SiteHeader } from '@repo/ui';

const UserManagement = () => {
	const siteStates = useUserManagementNavigation();
	const [siteState, setSiteState] = useState(siteStates[0]);
	
	return (
		<div>
			<SiteHeader
				title="Nutzerverwaltung"
				hasSiteNavigation
				navItems={siteStates}
				navCurrentItem={siteState}
				navOnClick={setSiteState}
			/>
			<UserOverview />
		</div>
	);
};

export default UserManagement;