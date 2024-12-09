import { FormDataClass } from '@repo/types';
import { useCreateColumns } from '@repo/ui';
import { ApolloRefetch } from '@repo/provider';

const useFormDataColumns = ({data, refetch}: {data: FormDataClass['data'], refetch: ApolloRefetch}) => {
	const columns = useCreateColumns<FormDataClass['data']>({
		data: Object.keys(data).map(key => {
			return ({
				id: key,
				type: 'edit_string',
				label: key        
			});
		}),    
            
		fields: [],
		className: 'Data',
		refetch,
		categories: []
	});
	return columns;
};

export default useFormDataColumns;