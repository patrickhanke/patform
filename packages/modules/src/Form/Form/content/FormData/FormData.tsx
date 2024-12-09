import { Table } from '@repo/ui';
import { generateGraphQLQuery } from '@repo/provider';
import { useQuery } from '@apollo/client';
import useFormDataColumns from './hooks/useFormDataColumns';

const FormData = ({formId}: {formId: string}) => {
	const {data, refetch} = useQuery(generateGraphQLQuery({
		type: 'find',
		objectName: 'Data',
		fields: ['objectId', 'createdAt', 'data']
	}), {
		variables: {reference: {_eq: formId} }
	});

	const columns = useFormDataColumns({data: data?.objects.findData.results, refetch});
	
	if (!data) {
		return null;
	}

	const formData= data.objects.findData.results;

	return (
		<div>
			<Table
				data={formData}
				columns={columns}
			/>
		</div>
	);
};

export default FormData;