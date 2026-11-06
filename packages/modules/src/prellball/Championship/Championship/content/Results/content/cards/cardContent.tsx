"use client";

import { ReactNode } from "react";
import {
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignUp,
	ClubClass,
	LocationClass,
	PersonClass
} from "@repo/types";
import { DivisionCategory, divisionShort } from "@repo/provider";
import { readPersonData } from "@repo/provider";
import { formatDateTime } from "@repo/provider";
import { resolveTeam } from "../../functions/resolveTeam";
import { MAX_PLAYER_COUNT_FOR_CARD } from "./cardLayout";

export type CardContext = {
	games: ChampionshipGame[];
	groups: ChampionshipGroup[];
	signups: ChampionshipSignUp[];
	clubs: ClubClass[];
	people: PersonClass[];
	locations: LocationClass[];
	matchDays: { id: string; date?: string; location_id?: string }[];
	divisions: DivisionCategory[];
};

const teamOf = (
	game: ChampionshipGame,
	slot: "team1" | "team2" | "referee",
	ctx: CardContext
) =>
	resolveTeam(
		game,
		slot,
		ctx.groups,
		ctx.games,
		ctx.signups,
		ctx.clubs,
		false
	);

const signupOf = (signupId: string | undefined, ctx: CardContext) =>
	ctx.signups.find((signup) => signup.id === signupId);

const playerOf = (
	game: ChampionshipGame,
	side: "a" | "b",
	index: number,
	ctx: CardContext
) => {
	const team = teamOf(game, side === "a" ? "team1" : "team2", ctx);
	const signup = signupOf(team.signupId, ctx);
	const personId = signup?.person_ids[index];
	const person = ctx.people.find((item) => item.objectId === personId);
	return {
		name: person?.name || person?.label || "",
		dtbId: readPersonData(person).dtb_id || "",
		captain: Boolean(personId && signup?.captain_id === personId)
	};
};

export const cardPlayerCount = (game: ChampionshipGame, ctx: CardContext) => {
	const left = signupOf(teamOf(game, "team1", ctx).signupId, ctx);
	const right = signupOf(teamOf(game, "team2", ctx).signupId, ctx);
	return Math.max(
		left?.person_ids.length || 0,
		right?.person_ids.length || 0,
		MAX_PLAYER_COUNT_FOR_CARD
	);
};

const countBoxes = () => (
	<div
		style={{
			display: "flex",
			flexWrap: "wrap",
			width: "100%",
			height: "100%",
			position: "absolute",
			top: 0,
			left: 0
		}}
	>
		{Array.from({ length: 10 }, (_, index) => (
			<div
				key={index}
				style={{
					width: "20%",
					height: "50%",
					border: "1px solid #c4c4c4",
					boxSizing: "border-box"
				}}
			/>
		))}
	</div>
);

export const cardContent = (
	type: string,
	game: ChampionshipGame,
	ctx: CardContext
): ReactNode => {
	if (type === "empt-label") return <p style={{ margin: 0 }}>Siehe unten.</p>;
	if (type === "durchgang") return <p style={{ margin: 0 }}>{game.pass}</p>;
	if (type === "feld") return <p style={{ margin: 0 }}>{game.field}</p>;
	if (type === "spielNr") return <p style={{ margin: 0 }}>{game.game_nr}</p>;
	if (type === "spielklasse") {
		const left = teamOf(game, "team1", ctx).division;
		const right = teamOf(game, "team2", ctx).division;
		const leftLabel = divisionShort(left, ctx.divisions) || "Mixed";
		const rightLabel = divisionShort(right, ctx.divisions) || "Mixed";
		return (
			<p style={{ margin: 0 }}>
				{leftLabel === rightLabel
					? leftLabel
					: `${leftLabel} / ${rightLabel}`}
			</p>
		);
	}
	if (type === "einspruch") return <p style={{ margin: 0 }}>Einspruch</p>;
	if (type === "gelbe-karten")
		return <p style={{ margin: 0 }}>Gelbe Karten</p>;
	if (type === "gelb-rote-karten")
		return <p style={{ margin: 0 }}>Gelb/Rote Karten</p>;
	if (type === "rote-karten") return <p style={{ margin: 0 }}>Rote Karten</p>;
	if (type === "verletzungen")
		return <p style={{ margin: 0 }}>Verletzungen</p>;
	if (type === "spielstand") {
		return (
			<div style={{ display: "flex", gap: "0.4cm" }}>
				<p style={{ margin: 0 }}>A</p>
				<p style={{ margin: 0 }}>:</p>
				<p style={{ margin: 0 }}>B</p>
			</div>
		);
	}
	if (type === "1-verl") return <p style={{ margin: 0 }}>1. Verl.</p>;
	if (type === "2-verl") return <p style={{ margin: 0 }}>2. Verl.</p>;
	if (type === "score") return <p style={{ margin: 0 }}>:</p>;
	if (type === "crossed-out") {
		return (
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					backgroundColor: "#dcdce0"
				}}
			/>
		);
	}
	if (type === "ende") return <p style={{ margin: 0 }}>Ende</p>;
	if (type === "halftime") return <p style={{ margin: 0 }}>Halbzeit</p>;
	if (type === "datum") {
		const matchDay = ctx.matchDays.find(
			(item) => item.id === game.match_day_id
		);
		return (
			<p style={{ margin: 0 }}>{formatDateTime(matchDay?.date).date}</p>
		);
	}
	if (type === "ort") {
		const matchDay = ctx.matchDays.find(
			(item) => item.id === game.match_day_id
		);
		const location = ctx.locations.find(
			(item) => item.objectId === matchDay?.location_id
		);
		return (
			<p style={{ margin: 0, marginLeft: "0.5cm" }}>
				{location?.address || "—"}
			</p>
		);
	}
	if (type === "count-first-row") {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					height: "100%",
					position: "absolute",
					top: 0,
					left: 0,
					padding: "0.02cm"
				}}
			>
				<p style={{ margin: 0, lineHeight: 1 }}>A</p>
				<p style={{ margin: 0, lineHeight: 1 }}>B</p>
			</div>
		);
	}
	if (type === "count-boxes") return countBoxes();
	if (type === "mannschaft-a" || type === "mannschaft-b") {
		const team = teamOf(
			game,
			type === "mannschaft-a" ? "team1" : "team2",
			ctx
		);
		const logo = ctx.clubs.find((club) => club.objectId === team.clubId)
			?.file?.url;
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.1cm",
					paddingLeft: ".6cm"
				}}
			>
				{logo ? (
					<img
						src={logo}
						alt=""
						width={15}
						height={15}
						style={{
							width: 15,
							height: 15,
							objectFit: "contain",
							flexShrink: 0
						}}
					/>
				) : null}
				<p
					style={{
						margin: 0,
						fontSize: "12px",
						fontWeight: 600
					}}
				>
					{team.label}
				</p>
			</div>
		);
	}
	if (type === "linienrichter-anschreiber") {
		return (
			<p
				style={{
					margin: 0,
					paddingLeft: "2cm",
					paddingTop: "0.3cm",
					fontSize: "9px"
				}}
			>
				{teamOf(game, "referee", ctx).label}
			</p>
		);
	}
	const playerMatch = /spieler-([ab])-(\d+)/.exec(type);
	if (playerMatch) {
		const player = playerOf(
			game,
			playerMatch[1] === "b" ? "b" : "a",
			Number(playerMatch[2]) - 1,
			ctx
		);
		return (
			<p
				style={{
					margin: 0,
					lineHeight: 1,
					textDecoration: player.captain ? "underline" : "none",
					fontSize: "9px"
				}}
			>
				{player.name}
			</p>
		);
	}
	const idMatch = /id-([ab])-(\d+)/.exec(type);
	if (idMatch) {
		const player = playerOf(
			game,
			idMatch[1] === "b" ? "b" : "a",
			Number(idMatch[2]) - 1,
			ctx
		);
		return (
			<p style={{ margin: 0, lineHeight: 1, fontSize: "9px" }}>
				{player.dtbId}
			</p>
		);
	}
	return null;
};
