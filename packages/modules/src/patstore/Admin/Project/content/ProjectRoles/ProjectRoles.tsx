import { FC } from "react";
import { axiosclient, useDataHandler, useFindData } from "@repo/provider";
import { ProjectRolesProps } from "./types";
import { Button, Divider, SlideInForm, Table } from "@repo/ui";
import useRoleColumns from "./hooks/useRoleColumns";
import { v4 } from "uuid";
import { PatstoreRoleClass } from "@repo/types";

const ProjectRoles: FC<ProjectRolesProps> = ({
	projectId,
	createRole,
	setCreateRole,
	modules
}) => {
	const { createData } = useDataHandler(true, false);

	const { data, refetch } = useFindData({
		objectName: "Role",
		fields: [
			"objectId",
			"name",
			"createdAt",
			"default",
			"admin",
			"modules {...on Element {value}}",
			"color",
			"title",
			"project {objectId name}",
			"users {edges{node{objectId name}}}",
			"roles {edges{node{objectId name}}}"
		],
		projectId
	});

	const columns = useRoleColumns({
		modules,
		roles: data ?? [],
		refetch: refetch,
		projectId
	});

	return (
		<div>
			<Button
				text="Rollen aktualisieren"
				onClick={() => {
					const roles = data ?? [];
					const adminRole = roles.find(
						(role: PatstoreRoleClass) => role.admin
					);
					if (adminRole) {
						axiosclient().post("functions/update_user_acl", {
							admin_role_id: adminRole.objectId,
							project_id: projectId
						});
					}
				}}
			/>
			<Divider />
			<Table data={data ?? []} columns={columns} />
			<SlideInForm
				title="Neue Rolle erstellen"
				isOpen={createRole}
				setIsOpen={setCreateRole}
				dataHandler={async (data) => {
					if (data.name && data.title) {
						await createData({
							className: "_Role",
							updateObject: {
								name: v4() as string,
								title: data.name,
								default: false,
								project: {
									__type: "Pointer",
									className: "Project",
									objectId: projectId
								},
								ACL: {
									"*": {
										read: true
									},
									Lr6euLiF4e: {
										read: true,
										write: true
									}
								}
							}
						});
						await refetch();
						setCreateRole(false);
					}
				}}
				fields={[
					{
						label: `Name`,
						id: "name",
						name: "name",
						type: "input",
						initialValue: {
							name: ""
						},
						placeholder: "Admin"
					}
				]}
			/>
		</div>
	);
};

export default ProjectRoles;
