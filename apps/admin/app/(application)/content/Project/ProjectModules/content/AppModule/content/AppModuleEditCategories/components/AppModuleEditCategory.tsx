import { useCallback, useContext, useMemo } from 'react';
import { AppContext, generateGraphQLQuery, paramsHandler } from '@repo/provider';
import { Select, StatelessToggle } from '@repo/ui';
import { Module, ModuleCategory } from '@repo/types';
import { AppModuleEditCategoryProps } from '../types';
import { useQuery } from '@apollo/client';

const AppModuleEditCategory = ({category, setCategory, projectId}: AppModuleEditCategoryProps) => {
	const {project} = useContext(AppContext);

	const {data} = useQuery(generateGraphQLQuery(
		{
			type: 'find', 
			objectName: 'Module', 
			fields: ['objectId', 'name', 'position', 'categories', 'connected_class']
		}
	), {
		variables: {params: paramsHandler({projectId})}
	});

	const changeHandler = useCallback(( value: {[key: string]: any}) => {
		if (category ) {
			setCategory((draft: ModuleCategory[]) => {
				const index: number = draft.findIndex(categoryToFind => categoryToFind.id === category.id);
				const fieldCopy: typeof category = {...category};
				if (index !== -1) {
					draft[index] = {...fieldCopy, ...value};
				}
			});
		}
	}, [category, setCategory]);

	const categorySelectOptions = useMemo(() => {
		const selectOptions: {value: string, label: string, connected_class: string}[] = [];
		if (data) {
			data.objects.findModule.results.forEach((module: Module) => {
				if (module.connected_class) {
					selectOptions.push({label: module.name, value: module?.objectId, connected_class: module.connected_class});
				}
			});
		}

		return selectOptions;
	}, [data]);

	if (!category) {
		return null;
	} 
    
	return (
		<div>
			<h3>{category.label}</h3>
			<div>
				<label>Label</label>
				<input type='text' defaultValue={category.label} onChange={(e) => changeHandler({label: e.target.value})} />
               
			</div>
			<div>
				<Select
					label='Typ auswählen'
					options={categorySelectOptions}
					value={category.moduleId}
					onChange={(e) => {
						changeHandler({moduleId: e.value as string, connected_class: e.connected_class});
					}}
				/>
			</div>
			<div>
				<StatelessToggle
					label='Mehrfachangaben zulassen'
					value={category.is_multi}
					onChange={(e) => changeHandler({is_multi: e})}
				/>
			</div>
           
		</div>
	);
};

export default AppModuleEditCategory;