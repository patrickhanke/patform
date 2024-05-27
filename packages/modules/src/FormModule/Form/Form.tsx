
'use client';

import FormDataContent from './content/FormData';
import { ApplicationTypes } from '@repo/types';

const Form = ({formId, siteState}: {formId: string, siteState: ApplicationTypes.SiteState}) => {
	return (
		<>
			{siteState.value === 'formData' && <FormDataContent formId={formId} />}
		</>
	);
};

export default Form;