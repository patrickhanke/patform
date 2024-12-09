import { useQuery } from '@apollo/client';
import { generateGraphQLQuery } from '@repo/provider';



export const useGetForm = ({formId}: {formId: string}) => {
	const { data, loading, refetch } = useQuery(generateGraphQLQuery({
		type: 'get',
		objectName: 'Form',
		fields: ['objectId', 'name', 'description', 'fields', 'categories']
	}), {
		variables: { id: formId }
	});

    console.log(data)

	return {
		form: data ? data.objects.getForm : null,
		loading,
		refetch
	};
};