import { FC } from "react";
import { RenderRecordDataProps } from "./types";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Worker } from "@repo/types";
import renderDayData from "./functions/renderDayData";
import { getDateString, months, useAppContext } from "@repo/provider";

import renderMonthTabel from "./functions/renderMonthTable";
import renderSurchargeTable from "./functions/renderSurchargeTable";
import renderDayTable from "./functions/renderDayTable";
import { DisplayWorker } from "@repo/ui";

const RenderRecordData: FC<RenderRecordDataProps> = ({
	year,
	month,
	worker,
	days,
	records,
	surcharges,
	fields
}) => {
	const { project } = useAppContext();

	const generatePDF = (worker: Worker) => {
		const workerDays = days.filter(
			(day) => day.user.objectId === worker.objectId
		);

		const dayData = renderDayData({
			year,
			month,
			days: workerDays,
			records: []
		});

		const doc = new jsPDF();

		// Add company logo/header
		doc.setFontSize(10);
		doc.text(
			`Zeitnachweis: ${getDateString(new Date(year, month, 1)).date} - ${getDateString(new Date(year, month + 1, 0)).date}`,
			20,
			10
		);
		doc.text(project?.data?.name || "", 20, 16);
		doc.text(`Erstellt: ${new Date().toLocaleString()}`, 130, 16);

		// Add basic information
		doc.setFontSize(10);

		// Personal Information Section
		doc.setFontSize(10);
		doc.text("Herr", 20, 30);
		doc.text(`${worker.first_name} ${worker.last_name}`, 20, 35);
		doc.text(worker.data?.street || "", 20, 40);
		doc.text(
			`${worker.data?.zip || ""} ${worker.data?.city || ""}`,
			20,
			45
		);

		doc.setFontSize(12);
		if (fields.includes("day_table")) {
			renderDayTable({
				doc,
				dayData
			});
		}

		doc.setFontSize(10);

		const currentMonth = months.find((m) => m.id === month);
		// const finalYDayTable = doc.lastAutoTable.finalY || 30;
		if (currentMonth) {
			if (fields.includes("month_table")) {
				doc.addPage();
				doc.text(`Zeitübersicht ${currentMonth.label} ${year}`, 20, 20);
				renderMonthTabel({
					doc,
					days,
					month: currentMonth,
					year,
					records,
					position: 25
				});
			}
			if (fields.includes("surcharge_table")) {
				const finalYMonthTable = doc.lastAutoTable.finalY || 30;
				doc.text(
					`Zuschläge ${currentMonth.label} ${year}`,
					20,
					finalYMonthTable + 20
				);
				renderSurchargeTable({
					doc,
					days,
					month: currentMonth,
					year,
					surcharges: surcharges,
					position: finalYMonthTable + 25
				});
			}
		}

		// Add footer
		const pageCount = doc.getNumberOfPages();
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(8);
			doc.text(
				`Seite ${i} of ${pageCount}`,
				doc.internal.pageSize.width / 2,
				287,
				{ align: "center" }
			);
		}

		// Download the PDF
		doc.save(`worker-record-${worker.first_name}-${worker.last_name}.pdf`);
	};

	return (
		<div className="horizontal_container">
			<div>
				<DisplayWorker workerId={worker.objectId} />
			</div>
			<button
				onClick={() => generatePDF(worker)}
				className="full_button sm light"
			>
				Download PDF
			</button>
		</div>
	);
};

export default RenderRecordData;
