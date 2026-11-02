"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { SlideIn } from "@repo/ui";
import { ChampionshipGame } from "@repo/types";
import { ChampionshipPageModel } from "../../../../types";
import {
	generateChampionshipGames,
	mergeGeneratedGames
} from "../functions/generateGames";
import { gameSlotLabel } from "../functions/gameSlot";
import { useAppContext } from "@repo/provider";
import useSeasonCategories from "../../../../../hooks/useSeasonCategories";
import useDivisionCategories from "../../../../../hooks/useDivisionCategories";
import { seasonCategoryId } from "../../../../../functions/season";
import { selectedDivisionIds } from "../../../../../functions/divisions";
import { ClubClass } from "@repo/types";

const GenerateGamesSlideIn: FC<{
	isOpen: boolean;
	page: ChampionshipPageModel;
	clubs: ClubClass[];
	onClose: () => void;
	onApply: (games: ChampionshipGame[]) => void;
}> = ({ isOpen, page, clubs, onClose, onApply }) => {
	const { project } = useAppContext();
	const seasons = useSeasonCategories(project?.objectId);
	const divisions = useDivisionCategories(project?.objectId);
	const seasonId = seasonCategoryId(page.categories, seasons);
	const divisionIds = selectedDivisionIds(page.categories, divisions);
	const [matchDayId, setMatchDayId] = useState("");
	const [groupIds, setGroupIds] = useState<string[]>([]);
	const [notes, setNotes] = useState("");
	const [replace, setReplace] = useState(true);
	const [preview, setPreview] = useState<ChampionshipGame[]>([]);

	const groupKey = page.data.groups.map((group) => group.id).join("|");
	const firstMatchDayId = page.data.match_days[0]?.id || "";

	useEffect(() => {
		if (!isOpen) return;
		setMatchDayId(firstMatchDayId);
		setGroupIds(groupKey ? groupKey.split("|") : []);
		setNotes("");
		setReplace(true);
		setPreview([]);
	}, [firstMatchDayId, groupKey, isOpen]);

	const matchDay = page.data.match_days.find(
		(item) => item.id === matchDayId
	);
	const selectedGroups = page.data.groups.filter((group) =>
		groupIds.includes(group.id)
	);

	const payload = useMemo(() => {
		if (!matchDay) return null;
		return {
			settings: page.settings,
			season: seasonId,
			division: divisionIds,
			group_mode: page.group_mode,
			match_day: matchDay,
			groups: selectedGroups,
			sign_ups: page.data.sign_ups,
			notes
		};
	}, [
		matchDay,
		notes,
		divisionIds,
		page.data.sign_ups,
		page.group_mode,
		seasonId,
		page.settings,
		selectedGroups
	]);

	const generate = () => {
		if (!payload || !matchDay) {
			setPreview([]);
			return;
		}
		const generated = generateChampionshipGames(payload);
		setPreview(
			mergeGeneratedGames([], generated, matchDay.id, groupIds, false)
		);
	};

	return (
		<SlideIn
			header="Spiele generieren"
			isOpen={isOpen}
			cancel={onClose}
			confirm={() => {
				if (!matchDay || preview.length === 0) return;
				onApply(
					mergeGeneratedGames(
						page.data.games,
						generateChampionshipGames({
							settings: page.settings,
							season: seasonId,
							division: divisionIds,
							group_mode: page.group_mode,
							match_day: matchDay,
							groups: selectedGroups,
							sign_ups: page.data.sign_ups,
							notes
						}),
						matchDay.id,
						groupIds,
						replace
					)
				);
			}}
			confirmText="Spiele übernehmen"
			disabled={[false, preview.length === 0]}
			size="large"
		>
			<div className="flex col a-st gap-sm">
				<p>
					Einstellungen, der gewählte Spieltag, die Gruppen und die
					Meldungen werden an die Generierung übergeben.
				</p>
				<label htmlFor="generate-matchday">Spieltag</label>
				<select
					id="generate-matchday"
					value={matchDayId}
					onChange={(event) => {
						setMatchDayId(event.target.value);
						setPreview([]);
					}}
				>
					{page.data.match_days
						.slice()
						.sort((a, b) => a.number - b.number)
						.map((item) => (
							<option key={item.id} value={item.id}>
								Spieltag {item.number}
							</option>
						))}
				</select>
				<p>Gruppen</p>
				{page.data.groups.map((group) => (
					<label key={group.id} className="flex row a-ce gap-sm">
						<input
							type="checkbox"
							checked={groupIds.includes(group.id)}
							onChange={(event) => {
								setPreview([]);
								setGroupIds((current) =>
									event.target.checked
										? [...current, group.id]
										: current.filter(
												(id) => id !== group.id
											)
								);
							}}
						/>
						{group.name}
					</label>
				))}
				<label htmlFor="generate-notes">Hinweise</label>
				<textarea
					id="generate-notes"
					value={notes}
					onChange={(event) => setNotes(event.target.value)}
				/>
				<label className="flex row a-ce gap-sm">
					<input
						type="checkbox"
						checked={replace}
						onChange={(event) => setReplace(event.target.checked)}
					/>
					Bestehende Spiele dieser Auswahl ersetzen
				</label>
				<button
					type="button"
					className="full_button sm"
					onClick={generate}
				>
					Vorschau erzeugen
				</button>
				{preview.length === 0 ? (
					<p>Noch keine Spiele erzeugt.</p>
				) : (
					<p>
						{preview.length} Spiele in{" "}
						{Math.max(...preview.map((game) => game.pass))}{" "}
						Durchgängen verteilt.
					</p>
				)}
				{preview.slice(0, 12).map((game) => (
					<p key={game.id}>
						Spiel {game.game_nr} · Dg. {game.pass} · Feld{" "}
						{game.field} ·{" "}
						{gameSlotLabel({
							game,
							slot: "team1",
							groups: page.data.groups,
							signups: page.data.sign_ups,
							clubs,
							games: preview,
							showClass: false
						})}
						{" – "}
						{gameSlotLabel({
							game,
							slot: "team2",
							groups: page.data.groups,
							signups: page.data.sign_ups,
							clubs,
							games: preview,
							showClass: false
						})}
					</p>
				))}
			</div>
		</SlideIn>
	);
};

export default GenerateGamesSlideIn;
