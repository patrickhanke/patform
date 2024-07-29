import { useQuery } from '@apollo/client';
import { paramsHandler } from '@repo/provider';
import find_persons from '../constants/find_persons';
import { UseFindPersonsHook } from '../types';

const useFindPerson: UseFindPersonsHook = ({moduleId, filters} ) => {
	const {loading, data, refetch} = useQuery(find_persons, {
		variables: {params: paramsHandler({moduleId, filters})},
		notifyOnNetworkStatusChange: true
	});

	return ({
		loading, 
		persons: data ? data.objects.findPerson.results : undefined,
		refetch
	});
};

export default useFindPerson;