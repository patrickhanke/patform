"use client";

import { FC, useContext } from "react";
import useTableColumns from "./hooks/useTableColumns";
import { PatflowAppContext, useDataStore } from "@repo/provider";
import CreateStaffMember from "./content/CreateStaffMember";
import { Table } from "@repo/ui";
import { UserOverviewProps } from "./types";

const UserOverview: FC<UserOverviewProps> = ({ isOpen, setIsOpen }) => {
	const { workers: data } = useDataStore();
	const { reloadWorkers } = useContext(PatflowAppContext);

	const columns = useTableColumns({
		refetch: async () => await reloadWorkers()
	});

	return (
		<>
			<div className="content_element no_padding">
				<Table columns={columns} data={data || []} />
			</div>
			<CreateStaffMember
				workers={data || []}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				refetch={reloadWorkers}
			/>
		</>
	);
};

export default UserOverview;
