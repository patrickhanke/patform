import {
	months,
	convertMillisecondsToString,
	getSurchargeData,
	SurchargeData,
	getOvertimeSaldo
} from "@repo/provider";
import autoTable from "jspdf-autotable";
import { jsPDF, type jsPDF as jsPDFType } from "jspdf";
import { Day, Surcharge } from "@repo/types";

const renderSurchargeTable = ({
	doc,
	days,
	month,
	year,
	surcharges = [],
	position
}: {
	doc: jsPDFType;
	days: Day[];
	month: (typeof months)[number];
	year: number;
	surcharges: Surcharge[];
	position: number;
}) => {
	if (surcharges.length === 0) {
		console.error("surcharges are empty");
	}

	return autoTable(doc, {
		startY: position,
		head: [["Zuschlag", "Stunden"]],

		body: (() => {
			const surchargeArray: Array<string[]> = [];
			const surchargeData: SurchargeData[] = getSurchargeData({
				surcharges,
				days,
				month: month.id,
				year
			});

			surchargeData.forEach((surcharge) => {
				if (surcharge.type === "overtime") {
					const overtimeSaldo = getOvertimeSaldo({
						days,
						surchargeId: surcharge.objectId,
						month: month.id,
						year
					});
					surchargeArray.push([
						surcharge.name,
						convertMillisecondsToString(surcharge.saldo)
					]);

					surchargeArray.push([
						`${surcharge.name} / pro Woche`,
						convertMillisecondsToString(overtimeSaldo.weeklySaldo)
					]);
					surchargeArray.push([
						`${surcharge.name} / pro Monat`,
						convertMillisecondsToString(overtimeSaldo.monthlySaldo)
					]);
				} else {
					surchargeArray.push([
						surcharge.name,
						convertMillisecondsToString(surcharge.saldo)
					]);
				}
			});

			return surchargeArray;
		})(),

		styles: { fontSize: 8 },
		headStyles: { fillColor: [66, 139, 202] }
	});
};

export default renderSurchargeTable;
