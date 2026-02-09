import { FC, useContext, useMemo, useState } from "react";
import { ElementSelectInterface, IconButton, SlideIn } from "@repo/ui";
import {
	getDateString,
	PatflowAppContext,
	useDataHandler,
	useFindData
} from "@repo/provider";
import { Record } from "@repo/types";
import { RecordSelectProps, SelectRecordElement } from "../types";

const RecordSelect: FC<RecordSelectProps> = ({
	initialSelectedRecords = [],
	refetch,
	surchargeId
}) => {
	const { updateData } = useDataHandler();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [connectedRecords, setConnectedRecords] = useState<string[]>(
		initialSelectedRecords || []
	);
	const { year } = useContext(PatflowAppContext);
	const { data } = useFindData({
		objectName: "Record",
		fields: [
			"objectId",
			"start_date",
			"end_date",
			"user { first_name last_name objectId }",
			"year"
		],
		filters: [{ key: "year", value: year, operator: "equalTo" }],
		skipQuery: !year
	});

	const elements = useMemo(() => {
		const elementArray: SelectRecordElement[] = [];
		data?.forEach((record: Record) => {
			elementArray.push({
				value: record.objectId,
				label: `${record.user.first_name} ${record.user.last_name} / ${getDateString(record.start_date).date}-${getDateString(record.end_date).date}`,
				user_id: record.user.objectId
			});
		});
		return elementArray;
	}, [data]);

	const records = data || [];

	return (
		<>
			<IconButton
				onClick={() => setOpen(true)}
				text={`${initialSelectedRecords ? initialSelectedRecords.length : 0} Zeiterfassungen ausgewählt`}
				icon="calendar"
			/>
			<SlideIn
				header="Zeiterfassungen auswählen"
				confirm={async () => {
					setLoading(true);
					await updateData({
						className: "Surcharge",
						objectId: surchargeId,
						updateObject: {
							connected_records: connectedRecords
						}
					});
					const updateRecordArray: Promise<any[]>[] = [];

					records.forEach((record: Record) => {
						const surcharges = record.surcharges || [];
						const isSelected = connectedRecords.includes(
							record.objectId
						);
						console.log(isSelected);

						if (isSelected && !surcharges.includes(surchargeId)) {
							updateRecordArray.push(
								updateData({
									className: "Record",
									objectId: record.objectId,
									updateObject: {
										surcharges: [...surcharges, surchargeId]
									}
								})
							);
						} else if (
							!isSelected &&
							surcharges.includes(surchargeId)
						) {
							updateRecordArray.push(
								updateData({
									className: "Record",
									objectId: record.objectId,
									updateObject: {
										surcharges: surcharges.filter(
											(surcharge: string) =>
												surcharge !== surchargeId
										)
									}
								})
							);
						}
					});
					await Promise.all(updateRecordArray);
					await refetch();
					setConnectedRecords(initialSelectedRecords);
					setLoading(false);
					setOpen(false);
				}}
				isOpen={open}
				cancel={() => {
					setOpen(false);
				}}
				showSecondaryContent={false}
				disabled={[loading, loading]}
				preventClickOutside
			>
				<ElementSelectInterface
					selectedElements={
						elements.filter((element: SelectRecordElement) =>
							connectedRecords?.includes(element.value)
						) || []
					}
					elements={elements}
					onSelect={(selectedElement) => {
						console.log("Selected Record ID:", selectedElement);
						setConnectedRecords(
							selectedElement.map(
								(element) => element.value
							) as string[]
						);
					}}
					title="Zeiterfassung auswählen"
					max={100}
					selectAll
				/>
			</SlideIn>
		</>
	);
};

export default RecordSelect;
