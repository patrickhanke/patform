import { FC, useState } from "react";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { ProjectRolesProps } from "./types";
import { SlideIn, Table } from "@repo/ui";
import CreateRole from "./components/CreateRole";
import useRoleColumns from "./hooks/useRoleColumns";

const ProjectRoles: FC<ProjectRolesProps> = ({
	projectId,
	createRole,
	setCreateRole,
	modules
}) => {
	const [loading, setLoading] = useState(false);
	const { createData } = useDataHandler();
	const [role, setRole] = useState({
		name: ""
	});

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
			<SlideIn
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
			</SlideIn>
		</div>
	);
};

export default ProjectRoles;
