import { useQuery } from '@apollo/client';
import { generateGraphQLQuery, paramsHandler } from '@repo/provider';
import { UseFindCategoryHook } from '../types';

const useFindCategory: UseFindCategoryHook = ({moduleId, filters} ) => {
	const {loading, data, refetch} = useQuery(generateGraphQLQuery({
		type: 'find', 
		objectName:  'Category',  
		fields: ['objectId', 'name', 'image', 'createdAt','data'] 
	}), {
		variables: {params: paramsHandler({moduleId, filters})},
		notifyOnNetworkStatusChange: true
	});

	return ({
		loading, 
		categories: data ? data.objects.findCategory.results : undefined,
		refetch
	});
};

export default useFindCategory;