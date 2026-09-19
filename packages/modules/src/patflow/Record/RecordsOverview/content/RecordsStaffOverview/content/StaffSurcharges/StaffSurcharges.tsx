import { FC, useMemo } from "react";
import {
	convertMillisecondsToString,
	getSurchargeData,
	useFindData,
	surchargeItemFields,
	surchargeItemFilters
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
		objectName: "Item",
		fields: surchargeItemFields,
		filters: surchargeItemFilters,
		projectId: projectId,
		skipQuery: !projectId
	});

	const surchargeData = useMemo(() => {
		let surcharges: (Surcharge & { saldo: number })[] = [];
		if (data) {
			surcharges = getSurchargeData({
				surcharges: (data || []) as Surcharge[],
				days,
				month: month.id,
				year
			});
		}

		return surcharges;
	}, [data, days, month, year]);

	return (
		<div>
			<h3>Zuschläge</h3>
			<div className="content_element">
				{surchargeData.map((surcharge) => {
					if (surcharge.data?.type === "overtime") {
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
										{surcharge.title}
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
											{surcharge.title} / pro Woche
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
											{surcharge.title} / pro Monat
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
								{surcharge.title}
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
