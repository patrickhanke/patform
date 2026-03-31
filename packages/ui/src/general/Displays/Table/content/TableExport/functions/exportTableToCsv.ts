import { saveAs } from "file-saver";
import { escapeCsvCell } from "./escapeCsvCell";

export type ExportTableToCsvParams = {
	title: string;
	subtitle: string;
	headers: string[][];
	rows: string[][];
	fileBaseName: string;
};

export const exportTableToCsv = ({
	title,
	subtitle,
	headers,
	rows,
	fileBaseName
}: ExportTableToCsvParams): void => {
	const metaLines: string[] = [];
	if (title.trim()) {
		metaLines.push(escapeCsvCell(title));
	}
	if (subtitle.trim()) {
		metaLines.push(escapeCsvCell(subtitle));
	}
	if (metaLines.length > 0) {
		metaLines.push("");
	}

	const headerRow = headers[0] ?? [];
	const headerLine = headerRow.map(escapeCsvCell).join(",");
	const bodyLines = rows.map((row) => row.map(escapeCsvCell).join(","));
	const csv = [...metaLines, headerLine, ...bodyLines].join("\r\n");
	const blob = new Blob(["\uFEFF" + csv], {
		type: "text/csv;charset=utf-8"
	});
	const safeName =
		fileBaseName.replace(/[^\w-]+/g, "_").slice(0, 80) || "export";
	saveAs(blob, `${safeName}.csv`);
};
