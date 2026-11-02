"use client";

import { FC } from "react";
import {
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignUp,
	ClubClass
} from "@repo/types";
import { gameSlotLabel, Slot } from "../functions/gameSlot";
import { DivisionCategory } from "../../../../../functions/divisions";

const GameTeamCell: FC<{
	game: ChampionshipGame;
	slot: Slot;
	groups: ChampionshipGroup[];
	signups: ChampionshipSignUp[];
	clubs: ClubClass[];
	games: ChampionshipGame[];
	showClass: boolean;
	divisions?: DivisionCategory[];
}> = (props) => {
	return <span>{gameSlotLabel(props)}</span>;
};

export default GameTeamCell;
