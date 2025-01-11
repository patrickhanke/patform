import React from 'react';
import { Page, UserMessages } from '@repo/ui';

const Dashboard = () => {
	return (
		<Page title='Dashboard'>
			<UserMessages />
		</Page>
	);
};

export default Dashboard;