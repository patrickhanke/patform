"use client";

import { FC } from "react";
import { CompetitionTabProps } from "../types";

const Placements: FC<CompetitionTabProps> = ({ Competition }) => {
	return (
		<div className="flex col a-st gap-sm">
			{Competition.groups.length === 0 ? (
				<p>Noch keine Gruppen vorhanden.</p>
			) : (
				Competition.groups.map((group) => (
					<div key={group.id} className="flex col a-st gap-sm">
						<h3>{group.name}</h3>
						{group.subgroups.map((subgroup) => (
							<div key={subgroup.id} className="flex col a-st">
								<strong>{subgroup.label}</strong>
								{subgroup.standings.length === 0 ? (
									<p>Noch keine Tabelle berechnet.</p>
								) : (
									<ol>
										{subgroup.standings.map((standing) => (
											<li key={standing.signupId}>
												{standing.place}.{" "}
												{standing.label} (
												{standing.pointsFor} Pkt.,{" "}
												{standing.ballsFor}:
												{standing.ballsAgainst})
											</li>
										))}
									</ol>
								)}
							</div>
						))}
					</div>
				))
			)}
		</div>
	);
};

export default Placements;
