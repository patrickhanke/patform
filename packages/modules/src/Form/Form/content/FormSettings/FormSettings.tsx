import React from 'react';
import './styles.scss'
import { generateGraphQLQuery } from '@repo/provider';
import { useQuery } from '@apollo/client';
import FormRecipients from './content/FormReceipients/FormRecipients';

const FormSettings = ({formId}: {formId: string}) => {
	const {data} = useQuery(generateGraphQLQuery({
		type: 'get',
		objectName: 'Form',
		fields: ['settings', 'objectId']

	}), {
		variables: {
			id: formId
		}
	});

	if (!data) return null;

	const settings =  data.objects.getForm.settings;

	return (
		<div className='form_settings_container'>
			<FormRecipients />
		</div>
	);
};

export default FormSettings;