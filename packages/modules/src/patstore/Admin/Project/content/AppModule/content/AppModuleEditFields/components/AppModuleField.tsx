import { Form } from "@repo/ui";

import { AppModuleFieldProps } from "../types";
import { useMemo } from "react";

const AppModuleField = ({ field, changeField }: AppModuleFieldProps) => {
	const formFields = useMemo(
		() => [
			{
				id: "active",
				label: "Aktiv",
				name: "active",
				type: "toggle",
				value: field.active,
				disabled: field.default
			},
			{
				id: "required",
				label: "Pflichtfeld",
				name: "required",
				type: "toggle",
				value: field.required,
				disabled: field.default
			},
			{
				id: "label",
				label: "Label",
				name: "label",
				type: "input",
				value: field.label,
				disabled: !field.active
			}
		],
		[field]
	);

	return (
		<>
			<div>
				<h3>{field.label}</h3>
			</div>
			<Form
				fields={formFields}
				data={field}
				formSubmitHandler={(values) =>
					changeField({ ...field, ...values })
				}
				showRequired={false}
				isHorizontal
				useWithDebounce
			/>
		</>
	);
};

export default AppModuleField;
