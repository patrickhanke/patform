'use client';

import { generateGraphQLQuery, paramsHandler } from '@repo/provider';
import { DnDDisplay, Page, sortItemsByPosition } from '@repo/ui';
import { Module } from '@repo/types';
import { useQuery } from '@apollo/client';
import AppModule from './content/AppModule';
import { useContext } from 'react';
import { AppContext } from '../../../provider';

const ProjectModules = ({params}: {params: {project_id: string}}) => {
	const {getCurrentProject} = useContext(AppContext);
	const {data, loading} = useQuery(generateGraphQLQuery(
		{
			type: 'find', 
			objectName: 'Module', 
			fields: ['objectId', 'name', 'createdAt', 'icon']
		}
	), {
		variables: paramsHandler({filters: [{key: 'project', value: params.project_id as string, operator: '_eq', id: 'projectId'}]} )
	});

	if (loading) return null;

	const modules = data?.objects.findModule.results;

	return (
		<Page 
			title={`${getCurrentProject(params.project_id)?.name} - Module`}
		>
			<DnDDisplay
				items={sortItemsByPosition(modules).map((module: Module) => ({...module, id: module.objectId})) || []}
				ItemComponent={({item}) => (<AppModule id={item.id} projectId={params.project_id} />)}
				objectClass='Module'
			/>
		</Page>
	);
};

export default ProjectModules;