import { useContext, useMemo } from "react";
import styles from "../WorkersInterface.module.scss";
import { DisplayWorkerInterfaceComponent } from "../types";
import { getImageUrl, useFindData } from "@repo/provider";
import { absence_type_options, PatflowAppContext } from "@repo/provider";
import { formatISO9075 } from "date-fns";
import { Absence, Day } from "@repo/types";
import { StateDisplay } from "@repo/ui";

const DisplayWorkerInterface = ({
	worker,
	isSelected,
	onChange,
	nextDate,
	showAvailability = true
}: DisplayWorkerInterfaceComponent) => {
	const { year } = useContext(PatflowAppContext);
	const { data } = useFindData({
		objectName: "Day",
		fields: [
			"objectId",
			"year",
			"month",
			"date",
			"is_working_day",
			"time",
			"default_time",
			"surcharges",
			"iso_date",
			"absence { objectId start_date end_date state type }",
			"saldo",
			"type",
			"iso_date",
			"user { objectId }"
		],
		filters: [
			{ key: "year", value: year, operator: "equalTo" },
			{ key: "type", value: "absence", operator: "equalTo" }
		],
		userId: worker.objectId,
		skipQuery: !showAvailability
	});

	const workerAbsence = useMemo(() => {
		let isAbsent = false;
		let type: Absence["type"] = "other";
		if (data && nextDate) {
			const dates: Day[] = data;
			const formattedNextDay = formatISO9075(new Date(nextDate), {
				representation: "date"
			});
			const dateObject = dates.find(
				(date) => date.date === formattedNextDay
			);

			if (dateObject) {
				isAbsent = true;
				type = dateObject?.absence?.type as Absence["type"];
			}
		}
		return {
			isAbsent,
			type,
			color: absence_type_options.find((option) => option.value === type)
				?.color,
			label: absence_type_options.find((option) => option.value === type)
				?.label
		};
	}, [data, showAvailability]);

	return (
		<button
			className={styles.display_worker_container}
			data-isselected={isSelected}
			disabled={workerAbsence.isAbsent}
			data-isabsent={workerAbsence.isAbsent}
			onClick={() =>
				onChange(isSelected ? "remove" : "add", worker.objectId)
			}
		>
			<div className={styles.display_worker_container_pers_data}>
				<div className={styles.display_worker_image_container}>
					{worker.portrait ? (
						<img
							src={getImageUrl({
								fileName: worker.portrait,
								height: 60,
								width: 60
							})}
							alt={`${worker.first_name} ${worker.last_name}`}
							width={"24px"}
							height={"24px"}
						/>
					) : null}
				</div>
				<h4>{`${worker.first_name} ${worker.last_name}`}</h4>
			</div>
			{workerAbsence.isAbsent &&
				workerAbsence.type &&
				workerAbsence.color &&
				workerAbsence.label && (
					<div className={styles.display_worker_absence}>
						<StateDisplay
							label={workerAbsence.label}
							color={workerAbsence.color}
						/>
					</div>
				)}
		</button>
	);
};

export default DisplayWorkerInterface;
