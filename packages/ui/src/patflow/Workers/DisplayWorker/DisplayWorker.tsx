import { useContext, useMemo } from "react";
import { useGetData } from "@repo/provider";
import { absence_type_options, PatflowAppContext } from "@repo/provider";
import { formatISO9075 } from "date-fns";
import { DisplayWorkersProps } from "./types";
import { getImageUrlFromBytescale } from "@repo/provider";
import { Loader, StateDisplay } from "@repo/ui";
import { Absence, Day } from "@repo/types";
import "./styles.scss";
import { Avatar, defineStyle } from "@chakra-ui/react";

const DisplayWorker = ({
	workerId,
	showState = false,
	nextDate,
	showAvailability = false,
	onlyImage = false
}: DisplayWorkersProps) => {
	const { year } = useContext(PatflowAppContext);

	const { workers } = useContext(PatflowAppContext);
	const { data, loading: dayLoading } = useGetData({
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
			{ key: "type", value: "absence", operator: "equalTo" },
			{ key: "user", value: workerId, operator: "equalTo" }
		],
		id: workerId,
		skip: !showAvailability
	});

	const workerAbsence = useMemo(() => {
		let isAbsent = false;
		let type: Absence["type"] = "other";
		if (data && nextDate) {
			const dates: Day[] = data.objects.findDay.results;
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

	const worker = workers?.find((worker) => worker.objectId === workerId);

	const ringCss = defineStyle({
		outlineWidth: "2px",
		outlineColor: workerAbsence.isAbsent ? workerAbsence.color : "green",
		// outlineOffset: "2px",
		outlineStyle: "solid",
		scale: 0.82
	});

	if (dayLoading) return <Loader width={"24px"} height={"24px"} />;

	if (worker) {
		return (
			<div
				className="display_worker_container"
				data-isabsent={workerAbsence.isAbsent}
				data-onlyimage={onlyImage}
			>
				<Avatar.Root
					colorPalette={worker.color}
					size={"2xs"}
					css={ringCss}
				>
					<Avatar.Fallback
						name={`${worker.first_name} ${worker.last_name}`}
					/>
					<Avatar.Image
						src={getImageUrlFromBytescale({
							filePath: worker.portrait,
							height: 60,
							width: 60
						})}
					/>
				</Avatar.Root>

				{!onlyImage && (
					<div>{`${worker.first_name} ${worker.last_name}`}</div>
				)}
				<div>
					{showState &&
						workerAbsence.isAbsent &&
						workerAbsence.type &&
						workerAbsence.color &&
						workerAbsence.label && (
							<div className="display_worker_absence">
								<StateDisplay
									label={workerAbsence.label}
									color={workerAbsence.color}
								/>
							</div>
						)}
				</div>
			</div>
		);
	}

	if (onlyImage) return <Loader width={"24px"} height={"24px"} />;

	return <span>Unbekannt</span>;
};

export default DisplayWorker;
