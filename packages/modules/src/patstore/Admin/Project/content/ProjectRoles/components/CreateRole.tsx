import { FC, useMemo } from "react";
import { Field, Form } from "@repo/ui";
import { CreateRoleProps } from "../types";

const CreateRole: FC<CreateRoleProps> = ({ role, setRole }) => {
	const formFields = useMemo(
		() => [
			{
				label: `Name`,
				id: "name",
				name: "name",
				type: "input",
				initialValue: role.name,
				placeholder: "Admin"
			} as Field
		],
		[role]
	);

	return (
		<div>
			<Form
				fields={formFields as Field[]}
				data={role}
				formSubmitHandler={(data: { name: string }) => {

					setRole(data);
				}}
			/>
		</div>
	);
};

export default CreateRole;
