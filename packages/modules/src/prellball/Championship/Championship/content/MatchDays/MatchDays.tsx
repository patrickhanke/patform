"use client";

import { FC, useState } from "react";
import { CreateButton, IconButton, Modal, usePageData } from "@repo/ui";
import { ChampionshipMatchDay } from "@repo/types";
import { ChampionshipPageModel, ChampionshipTabProps } from "@repo/modules";
import { formatDateTime } from "@repo/provider";
import {
	useAppContext,
	seasonCategoryTitle,
	useSeasonCategories
} from "@repo/provider";
import MatchDaySlideIn from "./components/MatchDaySlideIn";

const MatchDays: FC<ChampionshipTabProps> = ({ related }) => {
	const { project } = useAppContext<"patstore">();
	const seasons = useSeasonCategories(project?.objectId);
	const { data: page, setData } = usePageData<ChampionshipPageModel>();
	const [editor, setEditor] = useState<ChampionshipMatchDay | null>(null);
	const [creating, setCreating] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	if (!page) return null;

	const matchDays = [...page.data.match_days].sort(
		(a, b) => a.number - b.number
	);
	const open = creating || Boolean(editor);

	const saveMatchDay = (matchDay: ChampionshipMatchDay) => {
		const exists = page.data.match_days.some(
			(item) => item.id === matchDay.id
		);
		setData(
			"data.match_days",
			exists
				? page.data.match_days.map((item) =>
						item.id === matchDay.id
							? { ...item, ...matchDay }
							: item
					)
				: [...page.data.match_days, matchDay]
		);
		setEditor(null);
		setCreating(false);
	};

	return (
		<div className="flex col a-st gap-sm">
			{matchDays.map((matchDay) => {
				const club = related.clubs.find(
					(item) => item.objectId === matchDay.club_id
				);
				const location = related.locations.find(
					(item) => item.objectId === matchDay.location_id
				);
				const when = formatDateTime(matchDay.date);
				return (
					<div
						key={matchDay.id}
						className="flex row a-st j-sb gap-md content_element"
						style={{ flexWrap: "wrap", padding: "1rem" }}
					>
						<div>
							<p>Spieltag: Spieltag {matchDay.number}</p>
							<p>
								Saison:{" "}
								{seasonCategoryTitle(page.categories, seasons)}
							</p>
							<p>Ausrichter: {club?.title || "—"}</p>
							<p>Datum: {when.date}</p>
							<p>Uhrzeit: {when.time}</p>
						</div>
						<div>
							<p>Halle:</p>
							<p>{location?.title || "—"}</p>
							<p>{location?.address}</p>
							{matchDay.contact ? (
								<p>{matchDay.contact}</p>
							) : null}
						</div>
						<div className="flex col a-st gap-sm">
							<IconButton
								icon="edit"
								text="Spieltag bearbeiten"
								onClick={() => {
									setCreating(false);
									setEditor(matchDay);
								}}
							/>
							<IconButton
								icon="delete"
								text="Spieltag löschen"
								onClick={() => setDeleteId(matchDay.id)}
							/>
						</div>
					</div>
				);
			})}
			<CreateButton
				text="Neuen Spieltag erstellen"
				size="medium"
				onClick={() => {
					setEditor(null);
					setCreating(true);
				}}
			/>
			<MatchDaySlideIn
				isOpen={open}
				matchDay={editor}
				nextNumber={matchDays.length + 1}
				related={related}
				onClose={() => {
					setEditor(null);
					setCreating(false);
				}}
				onSave={saveMatchDay}
			/>
			<Modal
				isOpen={Boolean(deleteId)}
				header="Spieltag löschen"
				cancelButtonHandler={() => setDeleteId(null)}
				confirmButtonHandler={() => {
					setData(
						"data.match_days",
						page.data.match_days.filter(
							(item) => item.id !== deleteId
						)
					);
					setDeleteId(null);
				}}
				confirmButtonText="Spieltag löschen"
			>
				<p>Dieser Spieltag wird aus dem Wettkampf entfernt.</p>
			</Modal>
		</div>
	);
};

export default MatchDays;
