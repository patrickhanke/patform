import { Field, Form } from "@repo/ui";

import { AppModuleFieldProps } from "../types";
import { useMemo } from "react";

const AppModuleField = ({ field, changeField }: AppModuleFieldProps) => {
	const formFields = useMemo(
		() => [
			{
				id: "active",
				label: "Aktiv",
				name: "active",
				type: "toggle" as const,
				value: field.active,
				disabled: field.default
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
				<h3>
					{field.default === false
						? field.label
						: ` ${field.label} (Standardfeld)`}
				</h3>
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
