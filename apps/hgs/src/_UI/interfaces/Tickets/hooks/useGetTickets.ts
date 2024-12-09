import { FIND_ALL_TICKETS } from '@/queries';
import { ApolloRefetch, Filter, FilterOperator, Ticket } from '@/types';
import { useQuery } from '@apollo/client';
import { useGetTicketsHook } from '../types';

type GetTaskObject = {
	loading: boolean, 
	tickets?: Ticket[],
	refetch: ApolloRefetch
}

const paramsHandler = (id: string, className: string, filters: Filter[], archived: boolean) => {
	let filterObject = {};
	let objectObject = {};
	
	const archivedObject =  {'archived': {'_eq': archived}};
	if (id && className === 'Property') {
		objectObject =  {'property': {'_eq': id}};
	}

	if (filters && filters?.length > 0) {
		filterObject = filters?.reduce((acc: { [key: string]: { [ key in FilterOperator ]: any }}, filter: Filter) => {
			acc[filter.key] = {[filter.operator]: filter.value} as { [ key in FilterOperator ]: any };
			return acc;
		}, {});
	}
	return {...filterObject, ...archivedObject, ...objectObject};
};

const useGetTickets = ({id='', className='', filters, archived = false}: useGetTicketsHook) => {
	const {loading, data, refetch} = useQuery(FIND_ALL_TICKETS, {
		variables: {params: paramsHandler(id, className, filters, archived)},
		notifyOnNetworkStatusChange: true
	});

	return ({
		loading, 
		tickets: data ? data.objects.findTicket.results : undefined,
		refetch
	} as GetTaskObject);
};

export default useGetTickets;