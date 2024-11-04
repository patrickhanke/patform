import { useQuery } from '@apollo/client';
import { generateGraphQLQuery, paramsHandler } from '@repo/provider';
import { UseFindPersonsHook } from '../types';

const useFindPerson: UseFindPersonsHook = ({moduleId, filters} ) => {
	const {loading, data, refetch} = useQuery(generateGraphQLQuery({
		type: 'find',
		objectName: 'Person',
		fields: ['objectId', 'label', 'portrait']
	}), {
		variables: {params: paramsHandler({moduleId, filters})},
		notifyOnNetworkStatusChange: true,
		skip: !moduleId
	});

	return ({
		loading, 
		persons: data ? data.objects.findPerson.results : [],
		refetch
	});
};

export default useFindPerson;