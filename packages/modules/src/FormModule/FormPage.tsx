'use client';

import { Page } from '@repo/ui';
import { Form } from '@repo/modules';
import { ApplicationTypes } from '@repo/types';
import { useState } from 'react';

const siteStates: ApplicationTypes.SiteState[] = [
	{
		value: 'formData',
		label: 'Formular'
	},
	{
		value: 'formSettings',
		label: 'Einstellungen'
	}
];

const FormPage = ({params}: {params: ApplicationTypes.Params}) => {
	const [siteState, setSiteState] = useState(siteStates[0] as ApplicationTypes.SiteState);

	return (
		<Page 
			title='Form'
			siteStates={siteStates}
			activeState={siteState}
			navOnClick={setSiteState}
		>
			<Form formId={params.form_id} siteState={siteState} />
		</Page>
	);
};

export default FormPage; 