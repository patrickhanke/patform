import { Field, Form } from "@repo/ui";

import { AppModuleFieldProps } from "../types";
import { useMemo } from "react";
import default_fields from "../constants/default_fields";

const AppModuleField = ({
	field,
	changeField,
	modulePath
}: AppModuleFieldProps) => {
	const isDefault = default_fields[modulePath]?.includes(field.id);

	const formFields = useMemo(
		() => [
			{
				id: "active",
				label: "Aktiv",
				name: "active",
				type: "toggle" as const,
				value: field.active,
				disabled: false
			},
			{
				id: "required",
				label: "Pflichtfeld",
				name: "required",
				type: "toggle" as const,
				value: field.required
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
				fields={formFields as Field[]}
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
