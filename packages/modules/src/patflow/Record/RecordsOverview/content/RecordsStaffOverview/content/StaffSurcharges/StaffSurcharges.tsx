import { FC, useMemo } from "react";
import {
	convertMillisecondsToString,
	createDateIntervalForMonth,
	generateGraphQLQuery,
	paramsHandler
} from "@repo/provider";
import { useQuery } from "@apollo/client";
import { StaffSurchargesProps } from "./types";
import { Day, Surcharge } from "@repo/types";
import { get, set } from "lodash-es";
import getOvertimeSaldo from "./functions/getOvertimeSaldo";

const StaffSurcharges: FC<StaffSurchargesProps> = ({
	projectId,
	days,
	month,
	year
}) => {
	const { data } = useQuery(
		generateGraphQLQuery({
			type: "find",
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
			]
		}),
		{
			variables: {
				params: paramsHandler({
					filters: [
						{
							key: "project",
							value: projectId,
							operator: "_eq",
							id: "projectId"
						}
					]
				})
			}
		}
	);

	const surchargeData = useMemo(() => {
		let surcharges: (Surcharge & { saldo: number })[] = [];
		if (data) {
			surcharges =
				data.objects.findSurcharge.results.map((sc: Surcharge) => ({
					...sc,
					saldo: 0
				})) || [];
			const dateInterval = createDateIntervalForMonth(year, month.id);

			dateInterval.forEach((dayString) => {
				const dayArray = days.filter(
					(dayToFind: Day) => dayToFind.date === dayString
				);

				if (dayArray.length > 0) {
					dayArray.forEach((day: Day) => {
						if (
							day &&
							day.surcharges &&
							day.surcharges.length > 0
						) {
							day.surcharges.forEach(
								(surcharge: Day["surcharges"][number]) => {
									const surchargeIndex = surcharges.findIndex(
										(s) =>
											s.objectId ===
											surcharge.surcharge_id
									);
									if (surchargeIndex !== -1) {
										const saldo = get(
											surcharges,
											`[${surchargeIndex}].saldo`,
											0
										);
										set(
											surcharges,
											`[${surchargeIndex}].saldo`,
											saldo + surcharge.saldo
										);
									}
								}
							);
						}
					});
				}
			});
		}

		return surcharges;
	}, [data, days, month, year]);

	console.log({ surchargeData });

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
						console.log(surcharge);
						console.log(overtimeSaldo);

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
