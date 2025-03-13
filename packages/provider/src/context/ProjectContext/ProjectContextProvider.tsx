'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {ProjectContext} from './ProjectContext';
import { PatstoreProject } from '@repo/types';
import { generateGraphQLQuery } from '../../Apollo';
import { useQuery } from '@apollo/client';
import ProjectLoader from './components/ProjectLoader';

const ProjectContextProvider = ({projects, children}: {projects: string[], children: ReactNode}) => { 
	const [currentProject, setCurrentProject] = useState<PatstoreProject>();

	const [projectId, setProjectId] = useState<string | null | undefined>(localStorage.getItem('patstore_project_id') ?  localStorage.getItem('patstore_project_id') : projects[0]);

	const {data, loading, error} = useQuery((generateGraphQLQuery({
		type: 'get',
		objectName: 'Project',
		fields: ['objectId', 'name', 'path', 'logo', 'modules {results {objectId name path icon settings fields categories connected_class}}'],
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

	useEffect(() => {
		if (currentProject) {
			localStorage.setItem('patstore_project_id', currentProject.objectId);
			localStorage.setItem('patstore_project_path', currentProject.path);
		}
	}, [currentProject]);

	const loadProject = useCallback((projectId: string, initial?: boolean) => {
		if (initial) {
			const localId = localStorage.getItem('patstore_project_id');
			if (localId) {
				setProjectId(localId);
			} else {
				setProjectId(projectId);
			}
		}
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