"use client";

import { FC, useMemo } from "react";
import { ColumnDef, Select, Table } from "@repo/ui";
import { ChampionshipSignup } from "@repo/types";
import { ChampionshipTabProps } from "../types";
import { signupLabel } from "../functions/getTeamLabel";

type PlayerRow = {
	objectId: string;
	signupId: string;
	team: string;
	personId: string;
	name: string;
	email: string;
};

const Players: FC<ChampionshipTabProps> = ({
	championship,
	related,
	onUpdate,
	loading
}) => {
	const personOptions = related.people.map((person) => ({
		value: person.objectId,
		label:
			person.name ||
			person.label ||
			(person as { title?: string }).title ||
			person.email
	}));

	const rows: PlayerRow[] = championship.signups.flatMap((signup) => {
		if (signup.personIds.length === 0) {
			return [
				{
					objectId: `${signup.id}-empty`,
					signupId: signup.id,
					team: signupLabel(
						signup,
						related.clubs,
						championship.show_class
					),
					personId: "",
					name: "Keine Spieler zugeordnet",
					email: ""
				}
			];
		}
		return signup.personIds.map((personId) => {
			const person = related.people.find(
				(item) => item.objectId === personId
			);
			return {
				objectId: `${signup.id}-${personId}`,
				signupId: signup.id,
				team: signupLabel(
					signup,
					related.clubs,
					championship.show_class
				),
				personId,
				name:
					person?.name ||
					person?.label ||
					(person as { title?: string } | undefined)?.title ||
					personId,
				email: person?.email || ""
			};
		});
	});

	const updateSignupPeople = (signupId: string, personIds: string[]) => {
		const signups = championship.signups.map((signup) =>
			signup.id === signupId ? { ...signup, personIds } : signup
		);
		return onUpdate({ signups }, "Spieler aktualisiert");
	};

	const columns: ColumnDef<PlayerRow>[] = useMemo(
		() => [
			{
				accessorFn: (row) => row.team,
				header: () => <span>Mannschaft</span>,
				id: "team",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.name,
				header: () => <span>Person</span>,
				id: "name",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.email || "—",
				header: () => <span>E-Mail</span>,
				id: "email",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		],
		[]
	);

	return (
		<div className="flex col a-st gap-sm">
			<p>
				Spieler kommen aus dem Personen-Modul. Anwesenheit pro Spiel
				wird nicht auf Person geschrieben (kein Spieler.spiele-Feld).
			</p>
			{championship.signups.map((signup: ChampionshipSignup) => (
				<div key={signup.id} className="flex col a-st gap-sm">
					<strong>
						{signupLabel(
							signup,
							related.clubs,
							championship.show_class
						)}
					</strong>
					<Select
						id={`${signup.id}-people`}
						isMulti
						isDisabled={loading}
						options={personOptions}
						value={personOptions.filter((option) =>
							signup.personIds.includes(String(option.value))
						)}
						onChange={(options) => {
							const personIds = (
								Array.isArray(options)
									? options
									: options
										? [options]
										: []
							).map((option) => String(option.value));
							updateSignupPeople(signup.id, personIds);
						}}
					/>
				</div>
			))}
			<Table columns={columns} data={rows} />
		</div>
	);
};

export default Players;
