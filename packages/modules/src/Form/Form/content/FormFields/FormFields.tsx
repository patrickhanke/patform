import { useQuery } from '@apollo/client';
import { FC } from 'react';
import { generateGraphQLQuery } from '@repo/provider';
import { DnDDisplay } from '@repo/ui';
import { FormFieldsProps } from './types';
import CreateField from './content/CreateField/CreateField';
import FormField from './content/FormField';

const FormFields: FC<FormFieldsProps> = ({formId, createField, setCreateField}) => {
	const {data, refetch} = useQuery(generateGraphQLQuery({
		type: 'get',
		objectName: 'Form',
		fields: ['objectId', 'createdAt', 'fields']
	}), {
		variables: {id: formId }
	});

	if (!data) {
		return null;
	}

	return (
		<div>
			<DnDDisplay
				items={data?.objects.getForm.fields || []}
				ItemComponent={({item}) => (
						<FormField 
							formId={formId} 
							field={item} 
							refetch={refetch} 
							fields={data?.objects.getForm.fields || []} 
						/>
					)}
				objectClass='Form'
				subField={{
					id: formId,
					field: 'fields'
				}}
				refetch={refetch}
			/>
			<CreateField 
				createField={createField} 
				fields={data?.objects.getForm.fields || []} 
				setCreateField={setCreateField} 
				formId={formId} 
				refetch={refetch}
			/>
		</div>
	);
};

export default FormFields;