import { useQuery } from '@apollo/client';
import { generateGraphQLQuery, paramsHandler } from '@repo/provider';
import { UseFindGroupHook } from '../types';

const useFindGroup: UseFindGroupHook = ({moduleId, filters} ) => {
	const {loading, data, refetch} = useQuery(generateGraphQLQuery({
		type: 'find',
		objectName: 'Group',
		fields: ['objectId', 'label', 'times', 'title', 'image', 'state', 'fields', 'data', 'persons']
	}), {
		variables: {params: paramsHandler({moduleId, filters})},
		notifyOnNetworkStatusChange: true
	});

	return ({
		loading, 
		groups: data ? data.objects.findGroup.results : undefined,
		refetch
	});
};

export default useFindGroup;