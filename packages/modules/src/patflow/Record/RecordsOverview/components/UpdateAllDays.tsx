import { axiosclient, useFindDays } from "@repo/provider";
import { useCallback, useState } from "react";
import { Modal } from "@repo/ui";

const UpdateAllDays = ({
	resetDaysModal,
	setResetDaysModal
}: {
	resetDaysModal: boolean;
	setResetDaysModal: (resetDaysModal: boolean) => void;
}) => {
	const [loading, setLoading] = useState(false);
	const { data: days } = useFindDays({
		year: new Date().getFullYear(),
		skipQuery: !resetDaysModal,
		limit: 2000
	});

	const updateAllDays = useCallback(async () => {
		setLoading(true);
		const dayPromises: Array<Promise<object>> = [];
		days.forEach(async (day) => {
			if (!day.worktime) {
				dayPromises.push(
					axiosclient().post("/functions/create-time", {
						time: day.time,
						date: day.date,
						day_id: day.objectId,
						user_id: day.user.objectId,
						type: day.type || "work",
						comment: day.time?.comment || ""
					})
				);
			}
		});
		await Promise.all(dayPromises);
		setLoading(false);
		setResetDaysModal(false);
	}, [days]);

	return (
		<Modal
			header="Alle Daten aktualisieren"
			isOpen={resetDaysModal}
			cancelButtonHandler={() => setResetDaysModal(false)}
			confirmButtonHandler={() => updateAllDays()}
			confirmButtonText="Bestätigen"
			buttonDisabled={[loading, loading]}
			loading={loading}
		>
			<div>
				<p>
					Sind Sie sicher, dass Sie alle Daten aktualisieren möchten?
					Dieser Vorgang kann nicht rückgängig gemacht werden.
				</p>
			</div>
		</Modal>
	);
};

export default UpdateAllDays;
