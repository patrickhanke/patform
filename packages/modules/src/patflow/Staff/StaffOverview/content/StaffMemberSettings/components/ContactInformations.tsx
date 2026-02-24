import React, { useMemo } from "react";
import { Field, Form } from "@repo/ui";
import { ChangeUserSettingsProps } from "../types";

const ContactInformation: React.FC<ChangeUserSettingsProps> = ({
	data,
	setData
}) => {
	const fields = useMemo<Field[]>(
		() => [
			{
				id: "first_name",
				position: 1,
				name: "first_name",
				type: "input",
				label: "Vorname",
				validation: {
					required: "Pflichtfeld",
					min_length: 5,
					max_length: 36
				}
			},
			{
				id: "last_name",
				position: 2,
				name: "last_name",
				type: "input",
				label: "Nachname",
				validation: {
					required: "Pflichtfeld",
					min_length: 5,
					max_length: 36
				}
			},
			{
				id: "email",
				position: 3,
				name: "data.email",
				type: "input",
				label: "E-Mail",
				validation: {
					required: "Pflichtfeld",
					type: "email"
				}
			},
			{
				id: "phone",
				position: 3,
				name: "data.phone",
				type: "input",
				label: "Telefon",
				validation: {
					required: "Pflichtfeld",
					type: "phone"
				}
			},
			{
				id: "street",
				position: 3,
				name: "data.street",
				type: "input",
				label: "Straße"
			},
			{
				id: "zip",
				position: 3,
				name: "data.zip",
				type: "input",
				label: "PLZ"
			},
			{
				id: "city",
				position: 3,
				name: "data.city",
				type: "input",
				label: "Stadt"
			}
		],
		[]
	);

	return (
		<div>
			<h4>Kontakteinstellungen</h4>
			<Form
				fields={fields}
				data={data}
				formSubmitHandler={async (values) => {
					setData({ ...data, ...values });
				}}
				useWithDebounce
				isHorizontal
			/>
		</div>
	);
};

export default ContactInformation;
