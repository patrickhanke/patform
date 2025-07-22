import { FC, useMemo } from "react";
import { DisplayWorker, ElementSelectInterface, SelectElement } from "@repo/ui";
import { SelectStaffProps } from "../types";
import { Worker } from "@repo/types";

const SelectStaff: FC<SelectStaffProps> = ({
	staff,
	selectedWorker,
	setSelectedWorker
}) => {
	const elements = useMemo(() => {
		const workerOptionsArray: SelectElement[] = [];

		if (staff) {
			staff.forEach((worker: Worker) => {
				if (worker) {
					workerOptionsArray.push({
						value: worker.objectId,
						id: worker.objectId,
						label: `${worker.first_name} ${worker.family_name}`,
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
	}, [staff]);

	return (
		<div>
			<ElementSelectInterface
				title="Arbeiter auswählen"
				elements={elements}
				selectedElements={selectedWorker}
				onSelect={(values) => {
					setSelectedWorker(values.length > 0 ? values : []);
				}}
				max={1}
				isSearchable
			/>
		</div>
	);
};

export default SelectStaff;
