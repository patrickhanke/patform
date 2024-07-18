import { Module } from '@repo/types';


export const sortModuleByPosition = (modules: Module[]) => {
    
    if (modules) {
        console.log(modules);
		return [...modules].sort((a, b) => a.position - b.position);
	}
	return [];
};