import { Day, Surcharge } from "@repo/types";
import { createDateIntervalForMonth } from "../recordFunctions";
import { cloneDeep, get, set } from "lodash-es";

export type SurchargeData = Surcharge & {
	saldo: number;
};

const getSurchargeData = ({
	surcharges = [],
	days,
	year,
	month
}: {
	surcharges: Surcharge[];
	days: Day[];
	year: number;
	month: number;
}): SurchargeData[] => {
	const surchargeArray: SurchargeData[] = cloneDeep(
		surcharges.map((sc) => ({ ...sc, saldo: 0 }))
	);

	const dateInterval = createDateIntervalForMonth(year, month);

	dateInterval.forEach((dayString) => {
		const dayArray = days.filter(
			(dayToFind: Day) => dayToFind.date === dayString
		);

		if (dayArray.length > 0) {
			dayArray.forEach((day: Day) => {
				if (day && day.surcharges && day.surcharges.length > 0) {
					day.surcharges.forEach(
						(surcharge: Day["surcharges"][number]) => {
							const surchargeIndex = surchargeArray.findIndex(
								(s) => s.objectId === surcharge.surcharge_id
							);
							if (surchargeIndex !== -1) {
								const saldo = get(
									surchargeArray,
									`[${surchargeIndex}].saldo`,
									0
								);
								set(
									surchargeArray,
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

	return surchargeArray;
};

export default getSurchargeData;
