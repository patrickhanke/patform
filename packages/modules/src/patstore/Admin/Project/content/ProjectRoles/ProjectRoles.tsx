import { FC } from "react";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { ProjectRolesProps } from "./types";
import { SlideInForm, Table } from "@repo/ui";
import useRoleColumns from "./hooks/useRoleColumns";
import { v4 } from "uuid";

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
		refetch: refetch
	});

	return (
		<div>
			<Table
				data={data?.objects.find_Role.results || []}
				columns={columns}
			/>
			{/* <SlideIn
				header="Neue Rolle erstellen"
				isOpen={createRole}
				cancel={() => setCreateRole(false)}
				confirm={async () => {
					setLoading(true);
					await createData({
						className: "_Role",
						updateObject: {
							name: role.name,
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
					setLoading(false);
					setCreateRole(false);
				}}
				disabled={[loading, loading]}
				preventClickOutside
			>
				<div>
					{createRole && <CreateRole role={role} setRole={setRole} />}
				</div>
			</SlideIn> */}
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
