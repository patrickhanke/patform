"use client";

import { FC, useMemo } from "react";
import { ColumnDef, Table, TextInput, usePageData } from "@repo/ui";
import { PersonClass } from "@repo/types";
import { ChampionshipPageModel, ChampionshipTabProps } from "@repo/modules";
import { useAppContext } from "@repo/provider";
import {
	seasonCategoryId,
	seasonCategoryTitle,
	useDivisionCategories,
	useSeasonCategories,
	mergedPersonData,
	playedGameCount
} from "@repo/provider";
import IdDownload from "./components/IdDownload";
import ListDownload from "./components/ListDownload";
import { buildPlayerExportRows } from "./functions/playerExport";

const Players: FC<ChampionshipTabProps> = ({ related }) => {
	const { project } = useAppContext<"patstore">();
	const seasons = useSeasonCategories(project?.objectId);
	const { data: page, setData } = usePageData<ChampionshipPageModel>();
	const seasonId = seasonCategoryId(page?.categories, seasons);
	const seasonKey =
		seasonId ||
		seasonCategoryTitle(page?.categories, seasons).replace(/\s+/g, "_") ||
		"saison";
	const divisions = useDivisionCategories(project?.objectId);
	const people = useMemo(() => {
		if (!page || !page.data) return [];
		const ids = new Set(
			page.data.sign_ups.flatMap((signup) => signup.person_ids)
		);
		return related.people.filter((person) => ids.has(person.objectId));
	}, [page, related.people]);

	const exportRows = useMemo(
		() =>
			page
				? buildPlayerExportRows(
						people,
						page,
						related,
						seasonId,
						divisions
					)
				: [],
		[people, page, related, seasonId, divisions]
	);

	const championshipShort = page?.short || page?.title || "wettkampf";

	const columns: ColumnDef<PersonClass>[] = useMemo(
		() => [
			{
				id: "name",
				header: () => <span>Name</span>,
				accessorFn: (row) => row.name || row.label,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "club",
				header: () => <span>Verein</span>,
				accessorFn: (row) => {
					const data = mergedPersonData(
						row,
						page?.person_drafts || {}
					);
					return (
						related.clubs.find(
							(club) => club.objectId === data.club_id
						)?.title || "—"
					);
				},
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "dtb_id",
				header: () => <span>DTB-ID</span>,
				accessorFn: (row) => row.objectId,
				cell: (info) => {
					const person = info.row.original;
					const data = mergedPersonData(
						person,
						page?.person_drafts || {}
					);
					return !person.data?.id_confirmed ? (
						<TextInput
							id={`dtb-${person.objectId}`}
							defaultValue={data.dtb_id || ""}
							onChange={(value) =>
								setData(`person_drafts.${person.objectId}`, {
									...data,
									dtb_id: value
								})
							}
						/>
					) : (
						<p>{data.dtb_id}</p>
					);
				},
				footer: (info) => info.column.id
			},
			{
				id: "games",
				header: () => <span>Spiele</span>,
				accessorFn: (row) => {
					const data = mergedPersonData(
						row,
						page?.person_drafts || {}
					);
					return playedGameCount(data, seasonId);
				},
				cell: (info) => {
					const count = info.getValue() as number;
					if (!count) return "—";
					return count > 2
						? `${count} (festgespielt)`
						: String(count);
				},
				footer: (info) => info.column.id
			},
			{
				id: "confirm",
				header: () => <span>Bestätigen</span>,
				accessorFn: (row) => row.objectId,
				cell: (info) => {
					const person = info.row.original;
					const data = mergedPersonData(
						person,
						page?.person_drafts || {}
					);
					if (data.id_confirmed) return <p>DTB-ID bestätigt</p>;
					return (
						<button
							type="button"
							className="full_button sm"
							onClick={() =>
								setData(`person_drafts.${person.objectId}`, {
									...data,
									id_confirmed: true
								})
							}
						>
							DTB-ID bestätigen
						</button>
					);
				},
				footer: (info) => info.column.id
			}
		],
		[page, related.clubs, seasonId, setData]
	);

	if (!page) return null;

	return (
		<div className="flex col a-st gap-sm">
			<div className="flex row a-ce j-sb gap-sm">
				<h2>Spieler:innen</h2>
				{people.length > 0 && (
					<div className="flex row gap-sm">
						<ListDownload
							rows={exportRows}
							championshipShort={championshipShort}
							seasonKey={seasonKey}
						/>
						<IdDownload
							rows={exportRows}
							championshipShort={championshipShort}
							seasonKey={seasonKey}
						/>
					</div>
				)}
			</div>
			{people.length === 0 ? (
				<p>Noch keine Spieler:innen in den Meldungen.</p>
			) : (
				<Table
					columns={columns}
					data={people}
					rowStyles={() => ({
						padding: "0.5rem"
					})}
					rowIdResolver={(row) => (row as PersonClass).objectId}
				/>
			)}
		</div>
	);
};

export default Players;
