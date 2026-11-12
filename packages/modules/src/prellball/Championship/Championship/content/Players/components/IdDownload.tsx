"use client";

import { FC } from "react";
import { IconButton } from "@repo/ui";
import { exportDateSuffix, PlayerExportRow } from "../functions/playerExport";

const IdDownload: FC<{
	rows: PlayerExportRow[];
	championshipShort: string;
	seasonKey: string;
}> = ({ rows, championshipShort, seasonKey }) => {
	const download = () => {
		const body = rows.map((row) => row.dtbId).join("\n");
		const blob = new Blob([body], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `Spieler_innen-Ids_${championshipShort}_${seasonKey}_${exportDateSuffix()}.csv`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<IconButton
			text="IDs herunterladen"
			icon="download"
			onClick={download}
			disabled={rows.length === 0}
		/>
	);
};

export default IdDownload;
