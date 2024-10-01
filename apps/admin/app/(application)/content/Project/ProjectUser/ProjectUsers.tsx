'use client';

import React, { useContext, useMemo } from 'react'
import find_users from './constants/find_users'
import { useQuery } from '@apollo/client'
import { Table, useCreateColumns } from '@repo/ui'
import { AppContext } from '../../../provider'
import { ProjectUser } from './types';
import createUser from './constants/create_user';
import AdminPage from '../../../UI/AdminPage/AdminPage';

const ProjectUsers = ({params}: {params: {project_id: string}}) => {
    const {getCurrentProject} = useContext(AppContext);
	console.log(params.project_id);
	

	const {data, loading, error, refetch} = useQuery(find_users, {variables: {project: params.project_id}})
	
	
	const columns = useCreateColumns<ProjectUser>({
		data:[
			{id: 'portrait', type: 'edit_image', label: 'Bild'},
			{id: 'username', type: 'edit_string', label: 'Name'},
			{id: 'email', type: 'edit_textfield', label: 'Beschreibung'}
		],
		fields: undefined,
		className: '_User',
		refetch,
		categories: []
	});
    if (loading) return <p>Loading...</p>;
	if (error) return <p>Error...</p>;

	const users = data?.objects.find_User.results;

	return (
		<AdminPage 
			title={`${getCurrentProject(params.project_id)?.name} - Nutzer`}
			emptyContent={true}
			createClass={createUser(params.project_id)}
		>
			<Table
				data={users}
				columns={columns}
			/>
		</AdminPage>
  )
}

export default ProjectUsers