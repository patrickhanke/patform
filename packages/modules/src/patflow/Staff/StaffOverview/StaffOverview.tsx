"use client";

import { useQuery } from "@apollo/client";
import useTableColumns from "./hooks/useTableColumns";
import { FIND_ALL_STAFF } from "@repo/provider";
import { Page } from "@repo/ui";
import { Table } from "@repo/ui";

const StaffOverview = () => {
	const { data, refetch } = useQuery(FIND_ALL_STAFF, {
		notifyOnNetworkStatusChange: true
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
					data={data?.objects?.find_User?.results || []}
				/>
			</div>
		</Page>
	);
};

export default StaffOverview;
