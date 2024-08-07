'use client';

import { useQuery } from '@apollo/client';
import { Page } from '@repo/ui';
import React from 'react';
import get_project_settings from '../constants/get_project_settings';

const Project = ({params}) => {
	console.log(params);
	console.log(params.project_id);
    
	const {data, loading, error} = useQuery(get_project_settings,{variables: {id: params.project_id}});
	
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error...</p>;

	const project = data.objects.getProject;
    
	return (
		<Page 
			title={project.name}
			emptyContent={true}
		>
			<h2>
                Projekt
			</h2>
		</Page>
	);
};

export default Project;