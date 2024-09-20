import { useQuery } from '@apollo/client';
import { generateGraphQLQuery, paramsHandler } from '@repo/provider';
import { UseFindEventHook } from '../types';

const useFindEvent: UseFindEventHook = ({moduleId, filters} ) => {
	const {loading, data, refetch} = useQuery(generateGraphQLQuery({
		type: 'find', 
		objectName:  'Event',  
		fields: ['objectId', 'title', 'dates', 'createdAt', 'location', 'description', 'image', 'categories'] 
	}), {
		variables: {params: paramsHandler({moduleId, filters})},
		notifyOnNetworkStatusChange: true
	});

	return ({
		loading, 
		news: data ? data.objects.findEvent.results : undefined,
		refetch
	});
};

export default useFindEvent;