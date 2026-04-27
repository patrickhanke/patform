import { FC } from "react";
import { Select, TextInput } from "@repo/ui";
import { EditStaffDataProps, RoleSelect } from "../types";
import { CreatePatflowUser, PatflowUserRole } from "@repo/types";

const EditStaffData: FC<EditStaffDataProps> = ({
	staffMember = [],
	setStaffMember,
	errors,
	roles
}) => {
	return (
		<form>
			<TextInput
				label="Vorname"
				id={"first_name"}
				onChange={(value) =>
					setStaffMember((draft: CreatePatflowUser) => {
						draft.first_name = value;
					})
				}
				errors={errors}
			/>
			<TextInput
				label="Nachname"
				id={"last_name"}
				onChange={(value) =>
					setStaffMember((draft: CreatePatflowUser) => {
						draft.last_name = value;
					})
				}
				errors={errors}
			/>
			<TextInput
				label="E-Mail"
				id={"email"}
				type="email"
				onChange={(value) =>
					setStaffMember((draft: CreatePatflowUser) => {
						draft.email = value;
					})
				}
				errors={errors}
			/>
			<Select
				label="Rolle auswählen"
				id="role"
				errors={errors}
				options={roles.map((role: PatflowUserRole) => ({
					value: role.objectId,
					id: role.objectId,
					label: role.name
				}))}
				value={roles
					.map((role: PatflowUserRole) => ({
						value: role.objectId,
						id: role.objectId,
						label: role.name
					}))
					.find(
						(roleToFind: RoleSelect) =>
							roleToFind.id === staffMember.role
					)}
				onChange={(value) =>
					setStaffMember((draft: CreatePatflowUser) => {
						draft.role = value.value;
					})
				}
			/>
			<TextInput
				label="Passwort"
				type="password"
				id={"password"}
				onChange={(value) =>
					setStaffMember((draft: CreatePatflowUser) => {
						draft.password = value;
					})
				}
				errors={errors}
			/>
			<TextInput
				label="Passwort wiederholen"
				type="password"
				id={"repeat_password"}
				onChange={(value) =>
					setStaffMember((draft: CreatePatflowUser) => {
						draft.repeat_password = value;
					})
				}
				errors={errors}
			/>
		</form>
	);
};

export default EditStaffData;
