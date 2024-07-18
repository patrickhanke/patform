import {Project} from '@repo/types';

export const findModuleFields = (path: string, project: Project) => {
	console.log(path)
	console.log(project);
	
	return project.modules.results.find(module => module.path === path)?.fields;
};
