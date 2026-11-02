"use client";

import { FC, useEffect, useState } from "react";
import { Select, SlideIn } from "@repo/ui";
import { ChampionshipMatchDay } from "@repo/types";
import { ChampionshipRelatedData } from "@repo/modules";
import {
	createId,
	fromDateTimeLocal,
	toDateTimeLocal,
	selectString
} from "@repo/provider";

const createMatchDay = (number: number): ChampionshipMatchDay => ({
	id: createId(),
	number,
	date: "",
	club_id: "",
	location_id: "",
	fields: 4,
	contact: ""
});

const MatchDaySlideIn: FC<{
	isOpen: boolean;
	matchDay: ChampionshipMatchDay | null;
	nextNumber: number;
	related: ChampionshipRelatedData;
	onClose: () => void;
	onSave: (matchDay: ChampionshipMatchDay) => void;
}> = ({ isOpen, matchDay, nextNumber, related, onClose, onSave }) => {
	const [draft, setDraft] = useState<ChampionshipMatchDay>(
		createMatchDay(nextNumber)
	);

	useEffect(() => {
		if (!isOpen) return;
		setDraft(matchDay ? { ...matchDay } : createMatchDay(nextNumber));
	}, [isOpen, matchDay, nextNumber]);

	const clubOptions = related.clubs.map((club) => ({
		value: club.objectId,
		label: club.title
	}));
	const locationOptions = related.locations.map((location) => ({
		value: location.objectId,
		label: location.address
			? `${location.title} - ${location.address}`
			: location.title
	}));

	return (
		<SlideIn
			header={
				matchDay ? "Spieltag bearbeiten" : "Neuen Spieltag erstellen"
			}
			isOpen={isOpen}
			cancel={onClose}
			confirm={() => onSave(draft)}
			confirmText="Übernehmen"
		>
			<div className="flex col a-st gap-sm">
				<label htmlFor="matchday-number">Spieltag Nummer</label>
				<input
					id="matchday-number"
					type="number"
					value={draft.number}
					onChange={(event) =>
						setDraft((current) => ({
							...current,
							number: Number(event.target.value) || 1
						}))
					}
				/>
				<label htmlFor="matchday-date">Datum des Spieltags</label>
				<input
					id="matchday-date"
					type="datetime-local"
					value={toDateTimeLocal(draft.date)}
					onChange={(event) =>
						setDraft((current) => ({
							...current,
							date: fromDateTimeLocal(event.target.value)
						}))
					}
				/>
				<Select
					id="matchday-club"
					label="Ausrichtender Verein"
					isClearable
					options={clubOptions}
					value={
						clubOptions.find(
							(option) => option.value === draft.club_id
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							club_id: selectString(option)
						}))
					}
				/>
				<Select
					id="matchday-location"
					label="Spielort"
					isClearable
					options={locationOptions}
					value={
						locationOptions.find(
							(option) => option.value === draft.location_id
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							location_id: selectString(option)
						}))
					}
				/>
				<label htmlFor="matchday-fields">Anzahl Felder</label>
				<input
					id="matchday-fields"
					type="number"
					min={1}
					value={draft.fields}
					onChange={(event) =>
						setDraft((current) => ({
							...current,
							fields: Number(event.target.value) || 1
						}))
					}
				/>
				<label htmlFor="matchday-contact">Kontakt</label>
				<textarea
					id="matchday-contact"
					value={draft.contact || ""}
					onChange={(event) =>
						setDraft((current) => ({
							...current,
							contact: event.target.value
						}))
					}
				/>
			</div>
		</SlideIn>
	);
};

export default MatchDaySlideIn;
