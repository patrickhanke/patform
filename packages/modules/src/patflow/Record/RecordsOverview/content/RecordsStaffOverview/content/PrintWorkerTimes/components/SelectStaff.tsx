import { FC, useMemo } from "react";
import { DisplayWorker, ElementSelectInterface, SelectElement } from "@repo/ui";
import { SelectStaffProps } from "../types";
import { Worker } from "@repo/types";
import { useFindDataSecure } from "@repo/provider";

const SelectStaff: FC<SelectStaffProps> = ({
	selectedWorker,
	setSelectedWorker
}) => {
	const { data: staffData } = useFindDataSecure({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"is_worker",
			"portrait",
			"color",
			"time_settings",
			"number",
			"data",
			"role { objectId name type color }"
		],
		filters: [{ key: "is_worker", value: true, operator: "equalTo" }],
		order: "last_name_DESC",
		useMasterKey: true
	});

	const elements = useMemo(() => {
		const workerOptionsArray: SelectElement[] = [];

		if (staffData) {
			const staff = staffData;
			staff.forEach((worker: Worker) => {
				if (worker) {
					workerOptionsArray.push({
						value: worker.objectId,
						id: worker.objectId,
						label: `${worker.first_name} ${worker.last_name}`,
						data: worker,
						element: (
							<div>
								<DisplayWorker workerId={worker.objectId} />
							</div>
						)
					});
				}
			});
		}
		workerOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return workerOptionsArray;
	}, [staffData]);

	return (
		<div>
			<ElementSelectInterface
				title="Arbeiter auswählen"
				elements={elements}
				selectedElements={selectedWorker}
				onSelect={(values) => {
					setSelectedWorker(values.length > 0 ? values : []);
				}}
				max={100}
				isSearchable
			/>
		</div>
	);
};

export default SelectStaff;
