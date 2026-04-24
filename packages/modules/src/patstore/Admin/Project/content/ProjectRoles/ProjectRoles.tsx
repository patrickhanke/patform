import { FC } from "react";
import { axiosclient, useDataHandler, useFindData } from "@repo/provider";
import { ProjectRolesProps } from "./types";
import { Button, Divider, SlideInForm, Table } from "@repo/ui";
import useRoleColumns from "./hooks/useRoleColumns";
import { PatstoreRoleClass } from "@repo/types";
import createProjectName from "./functions/createProjectName";

const ProjectRoles: FC<ProjectRolesProps> = ({
	projectId,
	projectPath,
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
					if (!projectPath) {
						console.error("Project path is required");
						return;
					}
					if (data.title) {
						await createData({
							className: "_Role",
							updateObject: {
								name: createProjectName(
									data.title,
									projectPath
								),
								title: data.title,
								default: false,
								admin: false,
								modules: [],
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
						label: `Titel`,
						id: "title",
						name: "title",
						type: "input",
						initialValue: "",
						placeholder: "Admin"
					}
				]}
			/>
		</div>
	);
};

export default ProjectRoles;
