import React from "react";
import { HolidaysProps } from "./types";
import { useFindData } from "@repo/provider";
import useHolidayColumns from "./hooks/useHolidayColumns";
import CreateHolidayTemplate from "./content/CreateHolidayTemplate";
import { Table } from "@repo/ui";

const HolidayTemplates: React.FC<HolidaysProps> = ({
	projectId,
	createHolidayTemplate,
	setCreateHolidayTemplate,
	holidays
}) => {
	const { data, refetch } = useFindData({
		objectName: "Template",
		fields: ["objectId", "name", "label", "type", "holidays"],
		filters: [{ key: "type", value: "holiday", operator: "equalTo" }],
		projectId: projectId,
		skipQuery: !projectId
	});

	const columns = useHolidayColumns({ refetch, holidays });

	return (
		<>
			<div className="content_element no_padding">
				<Table data={data || []} columns={columns} />
			</div>
			<CreateHolidayTemplate
				templates={data || []}
				createTemplate={createHolidayTemplate}
				setCreateTemplate={setCreateHolidayTemplate}
				refetch={refetch}
				holidays={holidays}
			/>
		</>
	);
};

export default HolidayTemplates;
