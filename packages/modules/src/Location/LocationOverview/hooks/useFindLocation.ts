import { useQuery } from '@apollo/client';
import { generateGraphQLQuery, paramsHandler } from '@repo/provider';
import { UseFindLocationHook } from '../types';

const useFindLocation: UseFindLocationHook = ({moduleId, filters} ) => {
	const {loading, data, refetch} = useQuery(generateGraphQLQuery({
		type: 'find', 
		objectName:  'Location',  
		fields: ['objectId', 'name', 'image', 'createdAt', 'description', 'address', 'geopoint', 'categories'] 
	}), {
		variables: {params: paramsHandler({moduleId, filters})},
		notifyOnNetworkStatusChange: true
	});

	return ({
		loading, 
		locations: data ? data.objects.findLocation.results : undefined,
		refetch
	});
};

export default useFindLocation;