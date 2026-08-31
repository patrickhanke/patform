"use client";

import { FC } from "react";
import { CompetitionTabProps } from "../types";

const ImportTab: FC<CompetitionTabProps> = ({ Competition }) => {
	if (Competition.group_mode) {
		return (
			<p>
				Import ist nur verfügbar, wenn der Gruppenmodus deaktiviert ist.
			</p>
		);
	}

	return (
		<div className="flex col a-st gap-sm">
			<p>
				Spielplan-Vorlagen aus der Prellball-App liegen dort in einer
				eigenen Templates-Klasse. In patstore ist Template nur für
				E-Mails vorgesehen — dieser Import ist deshalb noch nicht
				angeschlossen.
			</p>
		</div>
	);
};

export default ImportTab;
