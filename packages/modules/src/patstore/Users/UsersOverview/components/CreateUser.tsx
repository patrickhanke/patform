import { FC, useMemo } from "react";
import { Field, Form } from "@repo/ui";
import { CreateUserProps, UserObject } from "../types";

const CreateUser: FC<CreateUserProps> = ({ user, setUser }) => {
	const formFields = useMemo(
		() => [
			{
				label: `E-Mail Adresse`,
				id: "username",
				name: "username",
				type: "input",
				value: user.username,
				placeholder: "beispiel@email.de",
				validation: {
					required: "Bitte geben Sie eine E-Mail-Adresse ein",
					email: true
				}
			} as Field,
			{
				label: `Benutzername`,
				name: "name",
				type: "input",
				value: user.name,
				dataType: "string",
				placeholder: "Vor- und Nachname",
				validation: {
					required: true
				}
			}
		],
		[user]
	);

	return (
		<Form
			fields={formFields as Field[]}
			data={user}
			formSubmitHandler={(data) => {
				setUser(data as UserObject);
			}}
		/>
	);
};

export default CreateUser;
