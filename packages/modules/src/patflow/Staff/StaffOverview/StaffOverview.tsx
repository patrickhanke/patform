"use client";

import useTableColumns from "./hooks/useTableColumns";
import { useFindData } from "@repo/provider";
import { Page } from "@repo/ui";
import { Table } from "@repo/ui";

const StaffOverview = () => {
	const { data, refetch } = useFindData({
		objectName: "User",
		fields: ["objectId", "first_name", "last_name", "email", "username", "role {name}"]
	});
	const columns = useTableColumns({ refetch });

	return (
		<Page
			title="Mitarbeiter"
			description="Informationen und Einstellungen zu den Mitarbeitern"
		>
			<div className="content_element no_padding">
				<Table
					columns={columns}
					data={data || []}
				/>
			</div>
		</Page>
	);
};

export default StaffOverview;
