
'use client';

import { PageNavigation } from "@repo/ui";
import { useState } from "react";
import FormDataContent from "./content/FormData";
import { ApplicationTypes } from "@repo/types";

const siteStates: {value: string, label: string}[] = [
	{
		value: 'formData',
		label: 'Formular'
	},
	{
		value: 'formSettings',
		label: 'Einstellungen'
	}
];

const Form = ({formId}: {formId: string}) => {
	const [siteState, setSiteState] = useState(siteStates[0]);

	return (
		<>
			<PageNavigation siteStates={siteStates} activeState={siteState} onClick={setSiteState} />
				{siteState.value === 'formData' && <FormDataContent formId={formId} />}

		</>
	);
};

export default Form;