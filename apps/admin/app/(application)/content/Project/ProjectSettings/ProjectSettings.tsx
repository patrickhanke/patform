'use client';

import { useQuery } from '@apollo/client';
import React from 'react';
import get_project_settings from './constants/get_project_settings';
import {Form} from '@repo/ui';
import settings_fields from './constants/settings_fields';
import { useDataHandler } from '@repo/provider';
import AdminPage from '../../../UI/AdminPage/AdminPage';

const Project = ({params}: {params: {project_id: string}}) => {
	const {data, loading, error} = useQuery(get_project_settings,{variables: {id: params.project_id}});
	const {updateData} = useDataHandler();
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error...</p>;

	const project = data.objects.getProject;
    
	return (
		<AdminPage 
			title={`${project.name} - Settings`}
			emptyContent={true}
		>
			<Form 
				fields={settings_fields}
				data={project}
				formSubmitHandler={(values) => {
					updateData({
						className: 'Project',
						objectId: project.objectId,
						updateObject: {
							name: values.name
						}
					});
				}}
				useWithDebounce
			/>
		</AdminPage>
	);
};

export default Project;