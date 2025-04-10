import { FC, useMemo } from "react";
import { Field, Form } from "@repo/ui";
import { CreateUserProps, UserObject } from "../types";

const CreateUser: FC<CreateUserProps> = ({ user, setUser, roles }) => {
	const formFields = useMemo(
		() => [
			{
				label: `E-Mail Adresse`,
				id: "username",
				name: "username",
				type: "input",
				initialValue: user.username,
				placeholder: "beispiel@email.de"
			} as Field,
			{
				label: `Benutzername`,
				name: "name",
				type: "input",
				initialValue: user.name,
				dataType: "string",
				placeholder: "Vor- und Nachname"
			},
			{
				label: `Rolle`,
				name: "role",
				type: "select",
				select_options: roles.map((role) => ({
					label: role.name,
					value: role.objectId
				})),
				initialValue: user.role,
				placeholder: "Rolle auswählen"
			}
		],
		[user, roles, roles.map((role) => role.objectId).join(",")]
	);

	return (
		<div>
			<Form
				fields={formFields as Field[]}
				data={user}
				formSubmitHandler={(data) => {
					setUser(data as UserObject);
				}}
			/>
		</div>
	);
};

export default CreateUser;
