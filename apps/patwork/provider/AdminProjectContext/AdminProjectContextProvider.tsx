'use client';

import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {AdminProjectContext} from './AdminProjectContext';
import { Module, Project } from '@repo/types';
import { generateGraphQLQuery } from '@repo/provider';
import { useQuery } from '@apollo/client';
import ProjectInitializer from './components/AdminProjectInitializer';

const ProjectContextProvider = ({children}: {children: ReactNode}) => { 
	
	const [currentProject, setCurrentProject] = useState<Project>();

	const [projectId, setProjectId] = useState<string>();

	const {data, loading, error} = useQuery((generateGraphQLQuery({
		type: 'get',
		objectName: 'Project',
		fields: ['objectId', 'name', 'modules'],
	})),
	{

		variables: {
			id: projectId,
		},
		skip: !projectId,
	})

	const user = JSON.parse(localStorage.getItem('user') || '{}');
	console.log(user);
	useEffect(() => {
		if (data) {
			setCurrentProject(data.objects.getProject);
		}
	}, [data]);

	const loadProject = useCallback((projectId: string) => {
		setProjectId(projectId);
	}, []);

	const projectContextObject = useMemo(() => ({
		project: currentProject,
		loadProject
	}), [currentProject]);

	return (
		<AdminProjectContext.Provider
			value={projectContextObject}
		>
			<ProjectInitializer loading={loading} error={error} project={currentProject} />
			{children}
		</AdminProjectContext.Provider>
	);
};

export default ProjectContextProvider;