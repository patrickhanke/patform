"use client";

import { FC } from "react";
import useTableColumns from "./hooks/useTableColumns";
import { useFindDataSecure } from "@repo/provider";
import CreateStaffMember from "./content/CreateStaffMember";
import { Table } from "@repo/ui";
import { UserOverviewProps } from "./types";

const UserOverview: FC<UserOverviewProps> = ({ isOpen, setIsOpen }) => {
	const { data, refetch } = useFindDataSecure({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"email",
			"username",
			"role {name}"
		],
		useMasterKey: true
	});

	const columns = useTableColumns({ refetch });

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
