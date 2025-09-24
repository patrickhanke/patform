import { Divider, Modal, SelectElement, Steps } from "@repo/ui";
import { useState, FC, useMemo, useCallback } from "react";
import modal_steps from "./constants/modal_steps";
import SelectStaff from "./components/SelectStaff";
import { ModalButtons, PrintWorkerTimesProps } from "./types";
import SelectTimes from "./components/SelectTimes";
import {
	axiosclient,
	generateGraphQLQuery,
	months,
	useDataContext
} from "@repo/provider";
import { useLazyQuery } from "@apollo/client";
import { Day } from "@repo/types";
import SelectFields from "./components/SelectFields";
import { RenderRecordData } from "./content";
import useGetDays from "./hooks/useGetDays";

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
	const [selectedFields, setSelectedFields] = useState<string[]>([]);
	const { days } = useGetDays({
		month: selectedTimes.month,
		users: selectedWorker.map((worker) => worker.value)
	});

	console.log({ selectedFields, selectedWorker });
	const [loading, setLoading] = useState(false);
	const [loadDays, { data }] = useLazyQuery(
		generateGraphQLQuery({
			objectName: "Day",
			type: "find",
			fields: ["objectId", "date", "time", "user {objectId}"]
		}),
		{
			variables: {
				params: {
					year: { _eq: selectedTimes.year },
					month: { _eq: selectedTimes.month },
					user: { _eq: selectedWorker[0]?.value }
				}
			}
		}
	);

	const closeModal = () => {
		setPageState(modal_steps[0]);
		setSelectedWorker([]);
		setLoading(false);
		setPrintWorkerTimes(false);
	};

	const updateUserHandler = useCallback(async () => {
		setLoading(true);
		await loadDays();

		if (data) {
			console.log({ dayData: data });
			const updateArray: Array<Promise<object>> = [];

			data.objects.findDay.results.forEach((day: Day) => {
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
					await loadDays();
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
					await loadDays();
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
			header="Monatsdaten aktualisieren"
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
					<SelectFields setFields={setSelectedFields} />
				)}
				{pageState.value === "confirm" && (
					<div>
						<h3>Daten:</h3>
						<div className="horizontal_container">
							<p className="label">Ausgewählte Arbeiter</p>
							{selectedWorker.map((worker) => (
								<p key={worker.id}>{worker.label}</p>
							))}
						</div>
						<div className="horizontal_container">
							<p className="label">Jahr</p>
							{selectedTimes.year}
						</div>
						<div className="horizontal_container">
							<p className="label">Monat</p>
							{
								months.find(
									(month) => month.id === selectedTimes.month
								)?.label
							}
						</div>
						<RenderRecordData
							workers={selectedWorker.map(
								(worker) => worker.data
							)}
							days={days}
							year={selectedTimes.year}
							month={selectedTimes.month}
						/>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default PrintWorkerTimes;
