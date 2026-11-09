"use client";

import { FC } from "react";
import { SlideIn } from "@repo/ui";
import { ChampionshipSignUp } from "@repo/types";
import { useAppContext } from "@repo/provider";
import { ChampionshipRelatedData } from "../../../../types";
import { divisionLabel } from "../../../../../functions/divisions";
import useDivisionCategories from "../../../../../hooks/useDivisionCategories";

const personName = (personId: string, related: ChampionshipRelatedData) => {
	const person = related.people.find((item) => item.objectId === personId);
	return person?.name || person?.label || personId;
};

const SignupDetails: FC<{
	isOpen: boolean;
	signup: ChampionshipSignUp | null;
	related: ChampionshipRelatedData;
	onClose: () => void;
}> = ({ isOpen, signup, related, onClose }) => {
	const { project } = useAppContext<"patstore">();
	const divisions = useDivisionCategories(project?.objectId);
	const divisionName = divisionLabel(signup?.division, divisions);

	return (
		<SlideIn
			header={divisionName || "Meldung"}
			isOpen={isOpen}
			cancel={onClose}
			showConfirmButton={false}
		>
			{signup ? (
				<div className="flex col a-st gap-sm">
					<h3>Spieler:innen</h3>
					{signup.person_ids.length === 0 ? (
						<p>Keine Spieler:innen</p>
					) : null}
					{signup.person_ids.map((personId) => (
						<p key={personId}>
							{personName(personId, related)}
							{signup.captain_id === personId
								? " · Spielführer:in"
								: ""}
						</p>
					))}
					<h3>Betreuer</h3>
					{signup.coach_ids.length === 0 ? (
						<p>Keine Betreuer</p>
					) : null}
					{signup.coach_ids.map((personId) => (
						<p key={personId}>{personName(personId, related)}</p>
					))}
					<h3>Schiedsrichter</h3>
					{signup.referee_ids.length === 0 ? (
						<p>Keine Schiedsrichter</p>
					) : null}
					{signup.referee_ids.map((personId) => (
						<p key={personId}>{personName(personId, related)}</p>
					))}
					<h3>Kommentar</h3>
					<p>{signup.comment || "—"}</p>
				</div>
			) : null}
		</SlideIn>
	);
};

export default SignupDetails;
