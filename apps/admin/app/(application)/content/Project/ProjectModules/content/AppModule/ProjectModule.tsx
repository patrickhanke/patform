import { generateGraphQLQuery } from '@repo/provider';
import { useQuery } from '@apollo/client';
import { Loader } from '@repo/ui';
import './styles.scss';
import AppModuleEditFields from './content/AppModuleEditFields';
import AppModuleEditCategories from './content/AppModuleEditCategories';
import AppModuleEditSettings from './content/AppModuleEditSettings';

const AppModule = ({id, projectId}: {id: string, projectId: string}) => {
	const {data, loading, refetch} = useQuery(generateGraphQLQuery(
		{
			type: 'get', 
			objectName: 'Module', 
			fields: ['objectId', 'name', 'createdAt', 'icon', 'path', 'settings', 'fields', 'name', 'position', 'categories', 'connected_class']
		}
	), {
		variables: {id}
	});
	if (loading) return <Loader width='100%' height='30px' />;

	const module = data?.objects.getModule;

	return (
		<div className='app_module_container'>
			<div style={{width: '300px'}}>
				<h3>{module.name}</h3>
			</div>
			{module.settings && <AppModuleEditSettings moduleId={id} initialSettings={module.settings} refetch={refetch} />}
			<AppModuleEditCategories moduleId={id} initialCategories={module.categories} projectId={projectId} />
			<AppModuleEditFields moduleId={id} initialFields={module.fields} />
		</div>
	);
};

export default AppModule;