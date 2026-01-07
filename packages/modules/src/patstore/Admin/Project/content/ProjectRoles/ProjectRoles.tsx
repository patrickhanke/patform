import { FC } from "react";
import {
	axiosclient,
	generateGraphQLQuery,
	useDataHandler
} from "@repo/provider";
import { useQuery } from "@apollo/client";
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

	const { data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "_Role",
			fields: [
				"objectId",
				"name",
				"createdAt",
				"default",
				"admin",
				"modules",
				"color",
				"title",
				"project {objectId name}",
				"users {results{objectId name}}",
				"roles {results{objectId name}}"
			]
		}),
		{
			variables: { params: { project: { _eq: projectId } } }
		}
	);

	const columns = useRoleColumns({
		modules,
		roles: data?.objects.find_Role.results || [],
		refetch: refetch,
		projectId
	});

	return (
		<div>
			<Button
				text="Rollen aktualisieren"
				onClick={() => {
					const roles = data?.objects.find_Role.results || [];
					const adminRole = roles.find(
						(role: PatstoreRoleClass) => role.admin
					);
					if (adminRole) {
						axiosclient().post("functions/update-user-acl", {
							admin_role_id: adminRole.objectId,
							project_id: projectId
						});
					}
				}}
			/>
			<Divider />
			<Table
				data={data?.objects.find_Role.results || []}
				columns={columns}
			/>
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
