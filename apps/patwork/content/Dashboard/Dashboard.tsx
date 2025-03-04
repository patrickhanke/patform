'use client';

import React, { useMemo, useState } from 'react';
import { AdminPage } from '../../ui';
import CreateProject from './content/CreateProject';

const Dashboard = () => {
	const [createProject, setCreateProject] = useState(false)
	// const page
	const pageHeaderButtons= useMemo(() => [
		{
			text: 'Neues Projekt',
			is_add_button: true,
			onClick: () => setCreateProject(true)
		}
	], []);

	return (
		<AdminPage 
			pageHeaderButtons={pageHeaderButtons}
			title='Dashboard'
		>
			<h2>Dashboard</h2>
			<p>Wähle ein Modul</p>
			<CreateProject 
				createProject={createProject} 
				setCreateProject={setCreateProject}
			/>
		</AdminPage>
	);
};

export default Dashboard;