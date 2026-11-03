"use client";

import { FC, useMemo } from "react";
import { ColumnDef, Table, usePageData } from "@repo/ui";
import { ChampionshipGame } from "@repo/types";
import { mergedPersonData } from "@repo/provider";
import { ChampionshipPageModel, ChampionshipTabProps } from "../../../types";

type RefereeRow = {
	id: string;
	name: string;
	club: string;
	games: number;
};

const ledGames = (
	personId: string,
	games: ChampionshipGame[],
	refereeGameIds: string[]
) =>
	games.filter((game) =>
		game.referee
			? game.referee === personId
			: refereeGameIds.includes(game.id)
	).length;

const Referees: FC<ChampionshipTabProps> = ({ related }) => {
	const { data: page } = usePageData<ChampionshipPageModel>();

	const referees = useMemo(() => {
		if (!page?.data) return [];
		const games = page.data.games;
		const registered = page.data.sign_ups.flatMap(
			(signup) => signup.referee_ids
		);
		const assigned = games.flatMap((game) =>
			game.referee ? [game.referee] : []
		);
		const ids = new Set([...registered, ...assigned]);

		related.people.forEach((person) => {
			const listed = mergedPersonData(
				person,
				page.person_drafts || {}
			).referee;
			if (
				listed?.some((gameId) =>
					games.some((game) => game.id === gameId)
				)
			) {
				ids.add(person.objectId);
			}
		});

		return [...ids]
			.map((personId): RefereeRow => {
				const person = related.people.find(
					(item) => item.objectId === personId
				);
				const data = mergedPersonData(person, page.person_drafts || {});
				const clubs = page.data.sign_ups
					.filter((signup) => signup.referee_ids.includes(personId))
					.map(
						(signup) =>
							related.clubs.find(
								(club) => club.objectId === signup.club_id
							)?.title
					)
					.filter((title): title is string => Boolean(title));
				const ownClub = related.clubs.find(
					(club) => club.objectId === data.club_id
				)?.title;
				return {
					id: personId,
					name: person?.name || person?.label || personId,
					club: [
						...new Set(
							clubs.length ? clubs : ownClub ? [ownClub] : []
						)
					].join(", "),
					games: ledGames(personId, games, data.referee || [])
				};
			})
			.sort(
				(a, b) =>
					b.games - a.games || a.name.localeCompare(b.name, "de")
			);
	}, [page, related.people, related.clubs]);

	const columns: ColumnDef<RefereeRow>[] = useMemo(
		() => [
			{
				id: "name",
				header: () => <span>Name</span>,
				accessorFn: (row) => row.name,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "club",
				header: () => <span>Verein</span>,
				accessorFn: (row) => row.club || "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "games",
				header: () => <span>Geleitete Spiele</span>,
				accessorFn: (row) => row.games,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		],
		[]
	);

	if (!page) return null;

	return (
		<div className="flex col a-st gap-sm">
			<h2>Schiedsrichter:innen</h2>
			{referees.length === 0 ? (
				<p>Noch keine Schiedsrichter:innen in den Meldungen.</p>
			) : (
				<Table
					columns={columns}
					data={referees}
					rowStyles={() => ({
						padding: "0.5rem"
					})}
					rowIdResolver={(row) => (row as RefereeRow).id}
				/>
			)}
		</div>
	);
};

export default Referees;
