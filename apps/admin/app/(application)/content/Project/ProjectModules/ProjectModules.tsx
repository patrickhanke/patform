'use client';

import { generateGraphQLQuery, paramsHandler, useDataHandler } from '@repo/provider';
import { DnDDisplay, sortItemsByPosition } from '@repo/ui';
import { Module } from '@repo/types';
import { useQuery } from '@apollo/client';
import AppModule from './content/AppModule';
import { useCallback, useContext, useMemo, useState } from 'react';
import { AppContext } from '../../../provider';
import AdminPage from '../../../UI/AdminPage/AdminPage';
import { SelectModule } from './types';
import CreateModule from './components/CreateModule';

const ProjectModules = ({params}: {params: {project_id: string}}) => {
	const {getCurrentProject} = useContext(AppContext);
	const [createModule, setCreateModule] = useState(false);
	const {createData} = useDataHandler();
	const {data, loading, refetch} = useQuery(generateGraphQLQuery(
		{
			type: 'find', 
			objectName: 'Module', 
			fields: ['objectId', 'name', 'createdAt', 'icon', 'path']
		}
	), {
		variables: {params: paramsHandler({filters: [{key: 'project', value: params.project_id, operator: '_eq', id: 'projectId'}]} )}
	});

	console.log(paramsHandler({filters: [{key: 'project', value: params.project_id as string, operator: '_eq', id: 'projectId'}]} ));
	const pageHeaderButtons = useMemo(() => [
		{
			text: 'Neues Modul',
			onClick: () => setCreateModule(true)
		}
	], [params.project_id]);	

	const createModuleHandler = useCallback(async (module: SelectModule['fields']) => {
		await createData({
			className: 'Module',
			updateObject: {
				...module,
				position: data?.objects.findModule.results.length + 1,
				project: {__type: 'Pointer', className: 'Project', objectId: params.project_id}
			}
		})
		await refetch();
		setCreateModule(false);
	}, [data]);

	if (loading) return null;

	const modules = data?.objects.findModule.results;

	return (
		<AdminPage 
			title={`${getCurrentProject(params.project_id)?.name} - Module`}
			pageHeaderButtons={pageHeaderButtons}
		>
			<DnDDisplay
				items={sortItemsByPosition(modules).map((module: Module) => ({...module, id: module.objectId})) || []}
				ItemComponent={({item}) => (<AppModule id={item.id} projectId={params.project_id} />)}
				objectClass='Module'
			/>
			<CreateModule
				createModule={createModule}
				setCreateModule={setCreateModule}
				createModuleHandler={createModuleHandler}
				modules={modules}
			/>
		</AdminPage>
	);
};

export default ProjectModules;