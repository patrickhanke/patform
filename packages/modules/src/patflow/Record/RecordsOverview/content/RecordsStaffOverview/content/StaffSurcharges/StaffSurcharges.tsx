import { FC, useMemo } from "react";
import {
	convertMillisecondsToString,
	getSurchargeData,
	useFindData
} from "@repo/provider";
import { StaffSurchargesProps } from "./types";
import { Surcharge } from "@repo/types";
import getOvertimeSaldo from "./functions/getOvertimeSaldo";

const StaffSurcharges: FC<StaffSurchargesProps> = ({
	projectId,
	days,
	month,
	year
}) => {
	const { data } = useFindData({
		objectName: "Surcharge",
		fields: [
			"objectId",
			"name",
			"createdAt",
			"active",
			"type",
			"time_value",
			"day_value",
			"work_value",
			"value",
			"start_date",
			"end_date"
		],
		filters: [
			{
				key: "project",
				value: projectId,
				operator: "equalTo",
				id: "projectId"
			}
		],
		skipQuery: !projectId
	});

	const surchargeData = useMemo(() => {
		let surcharges: (Surcharge & { saldo: number })[] = [];
		if (data) {
			surcharges = getSurchargeData({
				surcharges: data || [],
				days,
				month: month.id,
				year
			});
		}

		return surcharges;
	}, [data, days, month, year]);

	console.log(surchargeData);

	return (
		<div>
			<h3>Zuschläge</h3>
			<div className="content_element">
				{surchargeData.map((surcharge) => {
					if (surcharge.type === "overtime") {
						const overtimeSaldo = getOvertimeSaldo({
							days,
							surchargeId: surcharge.objectId,
							month: month.id,
							year
						});

						return (
							<div key={surcharge.objectId}>
								<div className="horizontal_container">
									<label className="surcharge_name">
										{surcharge.name}
									</label>
									<p>
										{convertMillisecondsToString(
											surcharge.saldo || 0
										)}
									</p>
								</div>
								{overtimeSaldo.weeklySaldo.toString() && (
									<div className="horizontal_container">
										<label className="surcharge_name">
											{surcharge.name} / pro Woche
										</label>
										<p>
											{convertMillisecondsToString(
												overtimeSaldo.weeklySaldo
											)}
										</p>
									</div>
								)}
								{overtimeSaldo.monthlySaldo.toString() && (
									<div className="horizontal_container">
										<label className="surcharge_name">
											{surcharge.name} / pro Monat
										</label>
										<p>
											{convertMillisecondsToString(
												overtimeSaldo.monthlySaldo
											)}
										</p>
									</div>
								)}
							</div>
						);
					}
					return (
						<div
							key={surcharge.objectId}
							className="horizontal_container"
						>
							<label className="surcharge_name">
								{surcharge.name}
							</label>
							<p>
								{convertMillisecondsToString(
									surcharge.saldo || 0
								)}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default StaffSurcharges;
