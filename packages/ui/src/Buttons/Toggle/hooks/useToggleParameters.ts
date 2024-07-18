import { ToggleType } from '../types';
import { DocumentNode } from '@apollo/client';

const useToggleParameters = (type: ToggleType) => {
	console.log(type);
	
	return ({
		className: '',
		query: undefined as unknown as DocumentNode,
		path: '.objects.getService.active',
		entry: ''
	});
  
};

export default useToggleParameters;