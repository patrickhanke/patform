import { Divider, Modal, SelectElement, Steps } from "@repo/ui";
import { useState, FC, useMemo, useCallback } from "react";
import modal_steps from "./constants/modal_steps";
import SelectStaff from "./components/SelectStaff";
import { ModalButtons, PrintWorkerTimesProps } from "./types";
import SelectTimes from "./components/SelectTimes";
import {
	axiosclient,
	months,
	useDataContext,
	useFindData
} from "@repo/provider";
import { Day } from "@repo/types";
import SelectFields from "./components/SelectFields";
import { RenderRecordData } from "./content";
import useFindDays from "./hooks/useFindDays";
import useFindRecord from "./hooks/useFindRecord";
import useFindSurcharges from "./hooks/useFindSurcharges";
import table_fields from "./constants/table_fields";

const PrintWorkerTimes: FC<PrintWorkerTimesProps> = ({
	printWorkerTimes,
	setPrintWorkerTimes
}) => {
	const { feedbackHandler } = useDataContext();

	const [pageState, setPageState] = useState<(typeof modal_steps)[number]>(
		modal_steps[0]
	);

	const [selectedWorker, setSelectedWorker] = useState<SelectElement[]>([]);
	const [selectedTimes, setSelectedTimes] = useState<{
		year: number;
		month: number;
	}>({ year: new Date().getFullYear(), month: new Date().getMonth() });
	const [selectedFields, setSelectedFields] = useState<
		Array<(typeof table_fields)[number]["value"]>
	>(table_fields.map((field) => field.value));
	const { days } = useFindDays({
		year: selectedTimes.year,
		users: selectedWorker.map((worker) => worker.value as string)
	});

	const { records } = useFindRecord({
		year: selectedTimes.year,
		users: selectedWorker.map((worker) => worker.value as string)
	});

	const { surcharges } = useFindSurcharges({
		year: selectedTimes.year,
		users: selectedWorker.map((worker) => worker.value as string)
	});

	const [loading, setLoading] = useState(false);
	const { data, refetch } = useFindData({
		objectName: "Day",
		fields: ["objectId", "date", "time", "user {objectId}", "year"],
		filters: [
			{ key: "year", value: selectedTimes.year, operator: "equalTo" }
		],
		userId: selectedWorker[0]?.value as string
	});

	const closeModal = () => {
		setPageState(modal_steps[0]);
		setSelectedWorker([]);
		setLoading(false);
		setPrintWorkerTimes(false);
	};

	const updateUserHandler = useCallback(async () => {
		setLoading(true);
		await refetch();

		if (data) {
			const updateArray: Array<Promise<object>> = [];

			data.forEach((day: Day) => {
				if (day.time) {
					updateArray.push(
						axiosclient().post("/functions/create-time", {
							time: day.time,
							date: day.date,
							day_id: day.objectId,
							user_id: day.user.objectId,
							type: day.type || "work"
						})
					);
				}
			});
			await Promise.all(updateArray);
			feedbackHandler({
				success: true,
				message: "Daten erfolgreich aktualisiert",
				type: "success"
			});
			closeModal();
		}

		setLoading(false);
	}, [data]);

	const modalButtons: ModalButtons = useMemo(() => {
		if (pageState.value === "workers") {
			return {
				text: "Weiter",
				onClick: () => {
					setPageState(modal_steps[1]);
				},
				disabled: [false, selectedWorker.length === 0]
			};
		} else if (pageState.value === "times") {
			return {
				text: "Weiter",
				onClick: async () => {
					setLoading(true);
					await refetch();
					setLoading(false);
					setPageState(modal_steps[2]);
				},
				disabled: [loading, loading]
			};
		} else if (pageState.value === "fields") {
			return {
				text: "Weiter",
				onClick: async () => {
					setLoading(true);
					await refetch();
					setLoading(false);
					setPageState(modal_steps[3]);
				},
				disabled: [loading, loading]
			};
		} else if (pageState.value === "confirm") {
			return {
				text: "Bestätigen",
				onClick: () => {
					updateUserHandler();
				},
				disabled: [loading, loading]
			};
		} else {
			return {
				text: "Bestätigen",
				onClick: () => {
					updateUserHandler();
				},
				disabled: [false, false]
			};
		}
	}, [pageState, selectedWorker, loading]);

	if (!printWorkerTimes) return null;

	return (
		<Modal
			header="Monatsdaten drucken"
			isOpen={printWorkerTimes}
			cancelButtonHandler={() => closeModal()}
			confirmButtonHandler={modalButtons.onClick}
			confirmButtonText={modalButtons.text}
			buttonDisabled={modalButtons.disabled}
		>
			<Steps
				steps={[...modal_steps]}
				step={modal_steps.findIndex(
					(step) => step.value === pageState.value
				)}
			/>
			<Divider size="large" showLine={false} />
			<div style={{ minHeight: "360px", width: "100%" }}>
				{pageState.value === "workers" && (
					<SelectStaff
						selectedWorker={selectedWorker}
						setSelectedWorker={setSelectedWorker}
					/>
				)}
				{pageState.value === "times" && (
					<SelectTimes
						selectedTimes={selectedTimes}
						setSelectedTimes={setSelectedTimes}
					/>
				)}
				{pageState.value === "fields" && (
					<SelectFields
						setFields={setSelectedFields}
						fields={selectedFields}
					/>
				)}
				{pageState.value === "confirm" && (
					<div>
						<h3>Daten:</h3>
						<div className="horizontal_container">
							<p className="label">Monat / Jahre</p>
							<p>{`${
								months.find(
									(month) => month.id === selectedTimes.month
								)?.label
							} / ${selectedTimes.year}`}</p>
						</div>
						<Divider size="small" showLine={false} />
						<div>
							{records &&
								surcharges &&
								selectedWorker.map((worker) => (
									<RenderRecordData
										key={worker.id}
										worker={worker.data}
										days={days}
										year={selectedTimes.year}
										month={selectedTimes.month}
										records={records.filter(
											(rc) =>
												rc.user.objectId === worker.id
										)}
										surcharges={surcharges}
										fields={selectedFields}
									/>
								))}
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default PrintWorkerTimes;
