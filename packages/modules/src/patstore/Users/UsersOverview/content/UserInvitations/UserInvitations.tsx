import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, useAppContext } from "@repo/provider";
import useInvitationColumns from "./hooks/useInvitationsColumns";
import { Table } from "@repo/ui";
import { useState } from "react";

const UserInvitations = () => {
	const { project } = useAppContext();
	const { data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "Project",
			fields: ["objectId", "name", "invitations"]
		}),
		{
			variables: { id: project.objectId }
		}
	);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	console.log({ data });

	const columns = useInvitationColumns({
		refetch,
		invitations: data ? data?.objects?.getProject?.invitations : [],
		projectId: project.objectId
	});

	if (!data) return <div>Loading</div>;

	const projectData = data.objects.getProject;

	return (
		<div>
			<Table
				columns={columns}
				data={projectData.invitations}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={projectData.invitations.length}
			/>
		</div>
	);
};

export default UserInvitations;
