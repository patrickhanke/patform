"use client";

import { FC, useContext } from "react";
import useTableColumns from "./hooks/useTableColumns";
import { PatflowAppContext, useFindDataSecure } from "@repo/provider";
import CreateStaffMember from "./content/CreateStaffMember";
import { Table } from "@repo/ui";
import { UserOverviewProps } from "./types";

const UserOverview: FC<UserOverviewProps> = ({ isOpen, setIsOpen }) => {
	const { project, roles } = useContext(PatflowAppContext);

	const { data, refetch } = useFindDataSecure({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"email",
			"username",
			"roles",
			"color",
			"data"
		],
		useMasterKey: true,
		projectId: project.objectId
	});

	console.log({ data });

	const columns = useTableColumns({
		refetch,
		roles
	});

	console.log({ roles });

	return (
		<>
			<div className="content_element no_padding">
				<Table columns={columns} data={data || []} />
			</div>
			<CreateStaffMember
				workers={data || []}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				refetch={refetch}
			/>
		</>
	);
};

export default UserOverview;
