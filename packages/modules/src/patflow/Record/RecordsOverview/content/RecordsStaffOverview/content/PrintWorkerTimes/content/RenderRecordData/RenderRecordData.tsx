import { FC } from "react";
import { RenderRecordDataProps } from "./types";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { Worker } from "@repo/types";
import renderDayData from "./functions/renderDayData";
import { convertMillisecondsToString, getDateString } from "@repo/provider";
import { DayDataTime } from "../../../StaffWorkingTimes";

const RenderRecordData: FC<RenderRecordDataProps> = ({
	year,
	month,
	workers,
	days
}) => {
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

		console.log({ dayData });

		const doc = new jsPDF();

		// Add company logo/header
		doc.setFontSize(20);
		doc.text("Worker Record", 20, 20);

		// Add basic information
		doc.setFontSize(12);
		doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

		// Personal Information Section
		doc.setFontSize(16);
		doc.text("Personal Information", 20, 45);

		// Create table for personal information
		autoTable(doc, {
			startY: 50,
			head: [["Datum", "Arbeitszeit", "Soll", "Ist", "Saldo"]],

			body: dayData.map((day) => {
				let startEnd = "";
				let saldoInt = 0;
				let hoursInt = 0;
				if (
					day &&
					day.default_time &&
					day.default_time.duration &&
					day.default_time.pause
				) {
					saldoInt =
						day.default_time.duration - day.default_time.pause;
					day?.time?.forEach((timeValue: DayDataTime) => {
						if (timeValue) {
							saldoInt -= timeValue.duration - timeValue.pause;
						}
					});
				} else if (day) {
					day?.time?.forEach((timeValue: DayDataTime) => {
						if (timeValue) {
							saldoInt -= timeValue.duration - timeValue.pause;
						}
					});
				}
				if (day.time) {
					day.time.forEach((time: DayDataTime, index: number) => {
						if (time && time?.start) {
							if (index > 0) {
								startEnd += " / ";
							}
							startEnd += `${getDateString(time.start).time} - ${getDateString(time.end).time}`;
						}
						hoursInt += time.duration - time.pause;
					});
				}
				const target = day.default_time?.duration
					? day.default_time?.duration - day.default_time?.pause
					: 0;
				return [
					getDateString(day.date).date,
					startEnd,
					convertMillisecondsToString(target || 0),
					convertMillisecondsToString(hoursInt || 0),
					convertMillisecondsToString(saldoInt)
				];
			}),

			styles: { fontSize: 10 },
			headStyles: { fillColor: [66, 139, 202] }
		});

		// Add footer
		const pageCount = doc.getNumberOfPages();
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(10);
			doc.text(
				`Seite ${i} of ${pageCount}`,
				doc.internal.pageSize.width / 2,
				287,
				{ align: "center" }
			);
		}

		// Download the PDF
		doc.save(
			`worker-record-${worker.first_name}-${worker.last_name}.pdf`
		);
	};

	return (
		<div className="workers-grid">
			{workers.map((worker, index) => (
				<div key={index} className="worker-card">
					<div className="worker-info">
						<h3>
							{worker.first_name} {worker.last_name}
						</h3>
					</div>
					<button
						onClick={() => generatePDF(worker)}
						className="download-btn"
					>
						Download PDF
					</button>
				</div>
			))}
		</div>
	);
};

export default RenderRecordData;
