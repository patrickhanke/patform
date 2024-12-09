import SiteHeader from '@/_UI/surfaces/SiteHeader';
import React from 'react';
import UserMessages from './content/UserMessages';

const Dashboard = () => {
	return (
		<>
			<SiteHeader title='Dashboard' />
			<UserMessages />
		</>
	);
};

export default Dashboard;