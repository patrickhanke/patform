import { Table } from '@repo/ui';
import { generateGraphQLQuery } from '@repo/provider';
import { useQuery } from '@apollo/client';
import useFormDataColumns from './hooks/useFormDataColumns';
import generateFormData from './functions/generateFormData';

const FormData = ({formId}: {formId: string}) => {
	const {data, refetch} = useQuery(generateGraphQLQuery({
		type: 'find',
		objectName: 'Data',
		fields: ['objectId', 'createdAt', 'data']
	}), {
		variables: {params:{reference_id: {_eq: formId}} }
	});

	console.log(formId);
	console.log(data);
	
	
	const columns = useFormDataColumns({data: data?.objects.findData.results, refetch});
	
	if (!data) {
		return null;
	}

	const formData = generateFormData(data.objects.findData.results.map((data: any) => data.data));

	return (
		<div>
			{formData.length === 0 ?
				<p>Keine Daten vorhanden</p> : 
				<Table
					data={formData}
					columns={columns}
				/>
			}
		</div>
	);
};

export default FormData;