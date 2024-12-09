
'use client';

import FormDataContent from './content/FormData';
import { useGetForm } from './hooks/useGetForm';
import siteStates from './constants/siteStates';
import { Loader, Page } from '@repo/ui';
import { useContext, useState } from 'react';
import { AppContext } from '@repo/provider';
import FormData from './content/FormData';
import FormSettings from './content/FormSettings';
import FormFields from './content/FormFields';
import { Params } from '@repo/types';

const Form = ({params}: {params: Params}) => {
	const formId = params.form_id;
	const {form, refetch} = useGetForm({formId});
	const {currentModule} = useContext(AppContext);
	const [siteState, setSiteState] = useState<{value: string, label: string}>(siteStates[0] as {value: string, label: string});	
	
	return (
		<Page 
			title={ form ? form?.name : 'Lädt ...' }
			emptyContent={true}
			refetch={refetch}
			pageStates={siteStates}
			activeState={siteState}
			navOnClick={setSiteState}
		>
			{!form ? <p>Formular nicht gefunden</p> : 
				<>
					{siteState.value === 'data' && <FormData formId={formId} />}
					{siteState.value === 'fields' && <FormSettings formId={formId} />}
					{siteState.value === 'formData' && <FormFields formId={formId} />}
				</>

			}
		</Page>
	);
};

export default Form;