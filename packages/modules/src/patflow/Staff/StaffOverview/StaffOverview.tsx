"use client";

import useTableColumns from "./hooks/useTableColumns";
import { AppContext, useFindDataSecure } from "@repo/provider";
import { Page } from "@repo/ui";
import { Table } from "@repo/ui";
import { useContext } from "react";

const StaffOverview = () => {
	const { project } = useContext(AppContext);
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
	const columns = useTableColumns({ refetch });

	return (
		<Page
			title="Mitarbeiter"
			description="Informationen und Einstellungen zu den Mitarbeitern"
		>
			<div className="content_element no_padding">
				<Table columns={columns} data={data || []} />
			</div>
		</Page>
	);
};

export default StaffOverview;
