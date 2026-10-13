"use client";

import { DisplayWorker, SlideIn } from "@repo/ui";
import { useDataHandler, useDataStore } from "@repo/provider";
import { StaffMember, Worker } from "@repo/types";
import { FC, useEffect, useMemo, useState } from "react";

import { ElementSelectInterface } from "@repo/ui";
import { DisplayWorkersProps, WorkerOption } from "../types";
import { AvatarGroup } from "@chakra-ui/react";

const DisplayWorkers: FC<DisplayWorkersProps> = ({
	propertyId,
	assignedStaff,
	refetch
}) => {
	const { updateData } = useDataHandler();
	const [isOpen, setIsOpen] = useState(false);
	const { workers } = useDataStore();
	const [loading, setLoading] = useState(false);
	const [selectedWorkers, setSelectedWorkers] = useState<
		Worker["objectId"][]
	>(assignedStaff || []);

	const elements = useMemo(() => {
		const workerOptionsArray: WorkerOption[] = [];
		if (workers.length > 0) {
			workers.forEach((worker: StaffMember) => {
				if (worker) {
					workerOptionsArray.push({
						value: worker.objectId,
						id: worker.objectId,
						label: `${worker.first_name} ${worker.last_name}`,
						element: (
							<DisplayWorker
								workerId={worker.objectId}
								propertyId={propertyId}
							/>
						)
					});
				}
			});
		}
		workerOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return workerOptionsArray;
	}, [workers, propertyId]);

	const workerComponent = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={
					elements.filter((element) =>
						selectedWorkers.includes(element.value)
					) || []
				}
				onSelect={async (values) => {
					setSelectedWorkers(
						values.map((value) => value.value as string)
					);
				}}
				max={100}
				isSearchable
			/>
		),
		[selectedWorkers]
	);

	useEffect(() => {
		if (isOpen) {
			setSelectedWorkers(assignedStaff || []);
		}
	}, [isOpen, assignedStaff]);

	return (
		<>
			{assignedStaff.length > 0 ? (
				<button
					onClick={() => setIsOpen(true)}
					style={{ cursor: "pointer" }}
				>
					<AvatarGroup>
						{assignedStaff.map((workerId: Worker["objectId"]) => (
							<DisplayWorker
								key={workerId}
								workerId={workerId}
								onlyImage
							/>
						))}
					</AvatarGroup>
				</button>
			) : (
				<button
					className="full_button sm light"
					onClick={() => setIsOpen(true)}
				>
					+ Arbeiter hinzufügen
				</button>
			)}
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					setLoading(true);
					await updateData({
						className: "Property",
						objectId: propertyId,
						updateObject: {
							assigned_staff: selectedWorkers
						},
						feedback: "Arbeiter erfolgreich geändert"
					});
					await refetch();
					setLoading(false);
					setIsOpen(false);
				}}
				loading={loading}
				header="Arbeiter auswählen"
			>
				{workerComponent}
			</SlideIn>
		</>
	);
};

export default DisplayWorkers;
