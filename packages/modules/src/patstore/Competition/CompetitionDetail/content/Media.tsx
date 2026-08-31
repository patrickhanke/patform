"use client";

import { FC } from "react";
import { PatstoreSelectImages } from "@repo/ui";
import { CompetitionTabProps } from "../types";

const Media: FC<CompetitionTabProps> = ({ Competition, onUpdate }) => {
	return (
		<div className="flex col a-st gap-sm">
			<p>Galerie der Meisterschaft (Bilder-Modul).</p>
			<PatstoreSelectImages
				image={Competition.gallery || []}
				maxFileCount={12}
				onChange={(images) =>
					onUpdate(
						{
							gallery: Array.isArray(images) ? images : [images]
						},
						"Galerie aktualisiert"
					)
				}
			/>
		</div>
	);
};

export default Media;
