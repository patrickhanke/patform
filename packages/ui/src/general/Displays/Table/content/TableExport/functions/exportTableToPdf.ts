import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { preparePdfBodyImages } from "./loadPdfImagesFromUrls";
import { PDF_IMAGE_MIN_CELL_HEIGHT_MM } from "../constants/values";

export type ExportTableToPdfParams = {
	title: string;
	subtitle: string;
	headers: string[][];
	rows: string[][];
	fileBaseName: string;
};

export const exportTableToPdf = async ({
	title,
	subtitle,
	headers,
	rows,
	fileBaseName
}: ExportTableToPdfParams): Promise<void> => {
	const { body: bodyRows, imagesByCellKey } =
		await preparePdfBodyImages(rows);

	const doc = new jsPDF({
		orientation: "landscape",
		unit: "mm",
		format: "a4"
	});

	let y = 14;
	doc.setFontSize(16);
	if (title.trim()) {
		doc.text(title, 14, y);
		y += 8;
	}
	doc.setFontSize(11);
	if (subtitle.trim()) {
		doc.text(subtitle, 14, y);
		y += 8;
	}

	autoTable(doc, {
		startY: y,
		head: headers,
		body: bodyRows,
		styles: { fontSize: 9, cellPadding: 2 },
		headStyles: {
			fillColor: [66, 139, 202],
			textColor: [255, 255, 255],
			fontStyle: "bold"
		},
		alternateRowStyles: { fillColor: [245, 245, 245] },
		margin: { left: 14, right: 14 },
		didParseCell: (data) => {
			if (data.section !== "body") {
				return;
			}
			const key = `${data.row.index}-${data.column.index}`;
			if (imagesByCellKey.has(key)) {
				data.cell.styles.minCellHeight = PDF_IMAGE_MIN_CELL_HEIGHT_MM;
			}
		},
		didDrawCell: (data) => {
			if (data.section !== "body") {
				return;
			}
			const key = `${data.row.index}-${data.column.index}`;
			const payload = imagesByCellKey.get(key);
			if (!payload) {
				return;
			}
			const cell = data.cell;
			const pad = 1.5;
			const maxW = Math.max(0, cell.width - 2 * pad);
			const maxH = Math.max(0, cell.height - 2 * pad);
			if (maxW <= 0 || maxH <= 0) {
				return;
			}
			const props = doc.getImageProperties(payload.dataUrl);
			const ratio = Math.min(maxW / props.width, maxH / props.height);
			const w = props.width * ratio;
			const h = props.height * ratio;
			const x = cell.x + (cell.width - w) / 2;
			const yPos = cell.y + (cell.height - h) / 2;
			doc.addImage(payload.dataUrl, payload.format, x, yPos, w, h);
		},
		didDrawPage: (data) => {
			const pageCount = doc.getNumberOfPages();
			doc.setFontSize(9);
			doc.text(
				`Seite ${data.pageNumber} von ${pageCount}`,
				doc.internal.pageSize.getWidth() / 2,
				doc.internal.pageSize.getHeight() - 8,
				{ align: "center" }
			);
		}
	});

	const safeName =
		fileBaseName.replace(/[^\w-]+/g, "_").slice(0, 80) || "export";
	doc.save(`${safeName}.pdf`);
};
