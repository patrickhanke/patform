import {Page, SiteHeader, UserMessages} from '@repo/ui';
import React from 'react';

const Dashboard = () => {
	return (
		<>
			<Page title='Dashboard' >
			<UserMessages />
			</Page>
		</>

	);
};

export default Dashboard;