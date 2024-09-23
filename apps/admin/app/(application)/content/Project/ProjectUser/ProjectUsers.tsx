'use client';

import React, { useContext } from 'react'
import find_users from './constants/find_users'
import { useQuery } from '@apollo/client'
import { Form, Page, Table, useCreateColumns } from '@repo/ui'
import { AppContext } from '../../../provider'
import users_fields from './constants/users_fields';
import { ProjectUser } from './types';

const ProjectUsers = ({params}: {params: {project_id: string}}) => {
    const {getCurrentProject} = useContext(AppContext);

    const {data, loading, error, refetch} = useQuery(find_users, {variables: {project: params.project_id}})
    if (loading) return <p>Loading...</p>;
	if (error) return <p>Error...</p>;

	const users = data?.objects.find_User.results;

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
    
	return (
		<Page 
			title={`${getCurrentProject(params.project_id)?.name} - Nutzer`}
			emptyContent={true}
		>
			<Table
				data={users}
				columns={columns}
			/>
		</Page>
  )
}

export default ProjectUsers