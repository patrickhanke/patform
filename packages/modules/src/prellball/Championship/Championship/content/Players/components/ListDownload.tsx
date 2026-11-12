"use client";

import { FC } from "react";
import * as XLSX from "xlsx";
import { IconButton } from "@repo/ui";
import { exportDateSuffix, PlayerExportRow } from "../functions/playerExport";

const ListDownload: FC<{
	rows: PlayerExportRow[];
	championshipShort: string;
	seasonKey: string;
}> = ({ rows, championshipShort, seasonKey }) => {
	const download = () => {
		const sheetRows = rows.map((row) => ({
			Name: row.name,
			Mannschaft: row.team,
			Einsätze: String(row.games),
			Festgespielt: row.games > 2 ? "ja" : "nein"
		}));
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(sheetRows);
		XLSX.utils.book_append_sheet(workbook, worksheet, "Spieler_innen");
		XLSX.writeFile(
			workbook,
			`Einsatzliste_${championshipShort}_${seasonKey}_${exportDateSuffix()}.xlsx`
		);
	};

	return (
		<IconButton
			text="Einsatzliste herunterladen"
			icon="download"
			color="secondary"
			onClick={download}
			disabled={rows.length === 0}
		/>
	);
};

export default ListDownload;
