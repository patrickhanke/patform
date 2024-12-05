
'use client';

import FormDataContent from './content/FormData';

const Form = ({formId, siteState}: {formId: string, siteState: {value: string, label: string}}) => {
	return (
		<>
			{siteState.value === 'formData' && <FormDataContent formId={formId} />}
		</>
	);
};

export default Form;