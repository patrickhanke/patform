import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getDateString } from "@repo/provider";

interface GeneratePdfExportProps {
	title: string;
	data: { [key: string]: string | undefined };
	date?: string;
	fileName?: string;
}

const generatePdfExport = ({
	title,
	data,
	date,
	fileName = "export"
}: GeneratePdfExportProps): void => {
	if (!data || Object.keys(data).length === 0) {
		console.warn("No data to export");
		return;
	}

	// Create a new PDF document
	const doc = new jsPDF({
		orientation: "portrait",
		unit: "mm",
		format: "a4"
	});

	// Add title
	doc.setFontSize(16);
	doc.text(title, 14, 15);
	if (date) {
		doc.setFontSize(10);
		doc.text(
			`${getDateString(date).date} - ${getDateString(date).time}`,
			14,
			20
		);
	}
	// Create key-value pairs as rows (horizontal layout)
	const rows = Object.entries(data).map(([key, value]) => [
		key,
		value || "-"
	]);

	// Add table with key-value pairs
	autoTable(doc, {
		startY: 25,
		head: [["Feld", "Wert"]],
		body: rows,
		styles: {
			fontSize: 10,
			cellPadding: 3
		},
		headStyles: {
			fillColor: [66, 139, 202],
			textColor: [255, 255, 255],
			fontStyle: "bold"
		},
		columnStyles: {
			0: { cellWidth: 60, fontStyle: "bold" },
			1: { cellWidth: 120 }
		},
		alternateRowStyles: {
			fillColor: [245, 245, 245]
		},
		margin: { top: 25, left: 15, right: 15, bottom: 10 },
		didDrawPage: (data) => {
			// Add footer with page number
			const pageCount = doc.internal.getNumberOfPages();
			doc.setFontSize(10);
			doc.text(
				`Seite ${data.pageNumber} von ${pageCount}`,
				doc.internal.pageSize.getWidth() / 2,
				doc.internal.pageSize.getHeight() - 10,
				{ align: "center" }
			);
		}
	});

	// Save the PDF
	doc.save(`${fileName}_${new Date().toISOString().split("T")[0]}.pdf`);
};

export default generatePdfExport;
