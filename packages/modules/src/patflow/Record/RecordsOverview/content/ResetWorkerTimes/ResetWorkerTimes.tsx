import { Divider, Modal, SelectElement } from "@repo/ui";
import { useState, FC, useMemo, useCallback } from "react";
import modal_states from "./constants/modal_states";
import SelectStaff from "./components/SelectStaff";
import { ModalButtons, ResetWorkerTimesProps } from "./types";
import SelectTimes from "./components/SelectTimes";
import {
	axiosclient,
	months,
	useDataContext,
	useFindData
} from "@repo/provider";
import { Day } from "@repo/types";

const ResetWorkerTimes: FC<ResetWorkerTimesProps> = ({
	resetWorkerTimes,
	setResetWorkerTimes
}) => {
	const { feedbackHandler } = useDataContext();

	const [pageState, setPageState] = useState<(typeof modal_states)[number]>(
		modal_states[0]
	);
	const [selectedWorker, setSelectedWorker] = useState<SelectElement[]>([]);
	const [selectedTimes, setSelectedTimes] = useState<{
		year: number;
		month: number;
	}>({ year: new Date().getFullYear(), month: new Date().getMonth() });

	const [loading, setLoading] = useState(false);
	const { data, refetch } = useFindData({
		objectName: "Day",
		fields: ["objectId", "date", "time", "user {objectId}", "year"],
		filters: [
			{ key: "year", value: selectedTimes.year, operator: "equalTo" },
			{ key: "month", value: selectedTimes.month, operator: "equalTo" }
		],
		userId: selectedWorker[0]?.value as string
	});

	const closeModal = () => {
		setPageState(modal_states[0]);
		setSelectedWorker([]);
		setLoading(false);
		setResetWorkerTimes(false);
	};

	const updateUserHandler = useCallback(async () => {
		setLoading(true);
		await refetch();
		if (data) {
			console.log({ dayData: data });
			const updateArray: Array<Promise<object>> = [];

			data.forEach((day: Day) => {
				if (day.time) {
					updateArray.push(
						axiosclient().post("/functions/create-time", {
							time: day.time,
							date: day.date,
							day_id: day.objectId,
							user_id: day.user.objectId,
							type: day.type || "work",
							comment: day.time.comment
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
					setPageState(modal_states[1]);
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
					setPageState(modal_states[2]);
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

	if (!resetWorkerTimes) return null;

	return (
		<Modal
			header="Monatsdaten aktualisieren"
			isOpen={resetWorkerTimes}
			cancelButtonHandler={() => closeModal()}
			confirmButtonHandler={modalButtons.onClick}
			confirmButtonText={modalButtons.text}
			buttonDisabled={modalButtons.disabled}
		>
			<div style={{ height: "480px", width: "240px" }}>
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
				{pageState.value === "confirm" && (
					<div>
						<p>
							Möchten Sie die Monatsdaten aktualisieren? Dieser
							Vorgang kann nicht rückgängig gemacht werden.
						</p>
						<Divider showLine={false} size="small" />
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
					</div>
				)}
			</div>
		</Modal>
	);
};

export default ResetWorkerTimes;
