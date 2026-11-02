import { FC } from "react";
import { Select, TextInput } from "@repo/ui";
import { EditStaffDataProps } from "../types";

const EditStaffData: FC<EditStaffDataProps> = ({
	staffMember,
	setStaffMember,
	errors,
	roles
}) => {
	const roleOptions = roles.map((role) => ({
		value: role.value,
		id: role.value,
		label: role.label
	}));

	return (
		<form>
			<TextInput
				label="Vorname"
				id="first_name"
				onChange={(value) =>
					setStaffMember((draft) => {
						draft.first_name = value;
					})
				}
				errors={errors}
			/>
			<TextInput
				label="Nachname"
				id="last_name"
				onChange={(value) =>
					setStaffMember((draft) => {
						draft.last_name = value;
					})
				}
				errors={errors}
			/>
			<TextInput
				label="E-Mail"
				id="email"
				type="email"
				onChange={(value) =>
					setStaffMember((draft) => {
						draft.email = value;
					})
				}
				errors={errors}
			/>
			<Select
				label="Rolle auswählen"
				id="role"
				errors={errors}
				options={roleOptions}
				value={roleOptions.find((role) =>
					staffMember.roles.includes(role.value)
				)}
				onChange={(value) =>
					setStaffMember((draft) => {
						draft.roles = [value.value];
					})
				}
			/>
			<TextInput
				label="Passwort"
				type="password"
				id="password"
				onChange={(value) =>
					setStaffMember((draft) => {
						draft.password = value;
					})
				}
				errors={errors}
			/>
			<TextInput
				label="Passwort wiederholen"
				type="password"
				id="repeat_password"
				onChange={(value) =>
					setStaffMember((draft) => {
						draft.repeat_password = value;
					})
				}
				errors={errors}
			/>
		</form>
	);
};

export default EditStaffData;
