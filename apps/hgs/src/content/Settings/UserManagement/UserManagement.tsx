'use client';

import SiteHeader from '@/_UI/surfaces/SiteHeader';
import React, { useState } from 'react';
import UserOverview from './content/UserOverview';
import useUserManagementNavigation from './hooks/useUserManagementNavigation';

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