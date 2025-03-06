'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {ProjectContext} from './ProjectContext';
import { Project } from '@repo/types';
import { generateGraphQLQuery } from '../../Apollo';
import { useQuery } from '@apollo/client';
import ProjectLoader from './components/ProjectLoader';

const ProjectContextProvider = ({projects, children}: {projects: string[], children: ReactNode}) => { 
	const [currentProject, setCurrentProject] = useState<Project>();

	const [projectId, setProjectId] = useState<string | undefined>(projects[0]);

	const {data, loading, error} = useQuery((generateGraphQLQuery({
		type: 'get',
		objectName: 'Project',
		fields: ['objectId', 'name', 'logo', 'modules {results {objectId name path icon settings fields categories connected_class}}'],
	})),
	{

		variables: {
			id: projectId,
		},
		skip: !projectId,
	})

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
		<ProjectContext.Provider
			value={projectContextObject}
		>
			<ProjectLoader loading={loading} error={error} project={currentProject} />
			{children}
		</ProjectContext.Provider>
	);
};

export default ProjectContextProvider;