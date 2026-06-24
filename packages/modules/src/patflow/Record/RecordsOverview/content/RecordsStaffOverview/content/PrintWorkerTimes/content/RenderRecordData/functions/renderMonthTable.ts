import { getMonthData, MonthData, months } from "@repo/provider";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import { Day, Record } from "@repo/types";

const renderMonthTabel = ({
	doc,
	days,
	month,
	year,
	records = [],
	position
}: {
	doc: jsPDF;
	days: Day[];
	month: (typeof months)[number];
	year: number;
	records: Record[];
	position: number;
}) => {
	if (records.length === 0) {
		console.error("records are empty");
	}
	return autoTable(doc, {
		startY: position,
		head: [["Art", "Stunden"]],

		body: (() => {
			const monthData: MonthData[] = getMonthData({
				days,
				month,
				year,
				records
			});
			const currentMonth = monthData.find((m) => m.id === month.id);
			if (!currentMonth) {
				return [];
			}

			return [
				["Saldo Vormonat", currentMonth.previousMonthSaldo],
				["Sollzeit", currentMonth.target],
				["Arbeitszeit", currentMonth.monthTimes],
				["Saldo", currentMonth.monthSaldo],
				["Zeitkonto", currentMonth.runningSaldo]
			];
		})(),

		styles: { fontSize: 8 },
		headStyles: { fillColor: [66, 139, 202] }
	});
};

export default renderMonthTabel;
