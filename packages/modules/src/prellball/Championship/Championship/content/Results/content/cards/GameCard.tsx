"use client";

import { FC, ReactNode, forwardRef } from "react";
import { ChampionshipGame } from "@repo/types";
import GameCardBox, { CardCell } from "./GameCardBox";
import {
	buildTeamRows,
	gameInfo,
	gameRecordings,
	MAX_PLAYER_COUNT_FOR_CARD,
	pointCard,
	results,
	signing,
	teamRow,
	teamRowEmpty
} from "./cardLayout";
import { CardContext, cardContent, cardPlayerCount } from "./cardContent";
import styles from "./gameCard.module.scss";

type CardRow = { id?: string; cells: CardCell[] };
type PrintGame = ChampionshipGame & { fillPlayers?: boolean; page?: number };

const asRows = (block: { rows: unknown[] }) => block.rows as CardRow[];

const Rows: FC<{
	rows: CardRow[];
	game: ChampionshipGame;
	ctx: CardContext;
}> = ({ rows, game, ctx }) => (
	<div className={styles.stack}>
		{rows.map((row, rowIndex) => (
			<div className={styles.row} key={row.id || rowIndex}>
				{row.cells.map((cell, cellIndex) => (
					<GameCardBox key={cell.id || cellIndex} cell={cell}>
						{cell.content
							? cardContent(cell.content, game, ctx)
							: null}
					</GameCardBox>
				))}
			</div>
		))}
	</div>
);

const pagesFor = (games: ChampionshipGame[], ctx: CardContext) => {
	const pages: PrintGame[][] = [];
	let index = 0;
	while (index < games.length) {
		const game = games[index];
		const next = games[index + 1];
		if (!game) break;
		const count = cardPlayerCount(game, ctx);
		const nextCount = next ? cardPlayerCount(next, ctx) : 0;
		if (
			count <= MAX_PLAYER_COUNT_FOR_CARD &&
			nextCount <= MAX_PLAYER_COUNT_FOR_CARD &&
			next
		) {
			pages.push([game, next]);
			index += 2;
		} else if (count > MAX_PLAYER_COUNT_FOR_CARD) {
			pages.push([
				{ ...game, fillPlayers: true, page: 1 },
				{ ...game, fillPlayers: true, page: 2 }
			]);
			index += 1;
		} else {
			pages.push([game]);
			index += 1;
		}
	}
	return pages;
};

const CutLine = ({ full }: { full: boolean }) => (
	<div className={styles.cut}>
		{full ? (
			<>
				<div className={styles.cutMark} style={{ left: 0 }} />
				<div className={styles.cutMark} style={{ right: 0 }} />
			</>
		) : (
			<>
				<p className={styles.scissors}>✂</p>
				<div className={styles.cutDash} />
			</>
		)}
	</div>
);

const GameSheet: FC<{
	game: PrintGame;
	index: number;
	title: string;
	season: string;
	ctx: CardContext;
	pagesLength: number;
}> = ({ game, index, title, season, ctx, pagesLength }) => {
	if (game.fillPlayers && game.page === 2) {
		return (
			<div>
				<div className={styles.playerPage}>
					<Rows
						rows={asRows(buildTeamRows(cardPlayerCount(game, ctx)))}
						game={game}
						ctx={ctx}
					/>
				</div>
			</div>
		);
	}
	return (
		<div>
			<h3 className={styles.heading}>
				Spielkarte Prellball - {title} - {season}
			</h3>
			<div className={styles.sheet}>
				<div className={styles.main}>
					<Rows rows={asRows(pointCard)} game={game} ctx={ctx} />
					<div className={styles.resultsRow}>
						<Rows rows={asRows(results)} game={game} ctx={ctx} />
						<GameCardBox
							cell={{
								width: 4.5,
								hasLabel: true,
								label: "Sieger",
								position: "top",
								height: "1.2cm",
								borderBottom: "regular"
							}}
						/>
					</div>
					<Rows
						rows={asRows(game.fillPlayers ? teamRowEmpty : teamRow)}
						game={game}
						ctx={ctx}
					/>
				</div>
				<div className={styles.side}>
					<Rows rows={asRows(gameInfo)} game={game} ctx={ctx} />
					<GameCardBox
						cell={{
							width: 4,
							hasLabel: true,
							label: "Division",
							position: "top",
							height: "1cm",
							borderBottom: "regular",
							bottomContent: true
						}}
					>
						{cardContent("spielklasse", game, ctx) as ReactNode}
					</GameCardBox>
					<Rows rows={asRows(gameRecordings)} game={game} ctx={ctx} />
					<Rows rows={asRows(signing)} game={game} ctx={ctx} />
				</div>
			</div>
			{index === 0 ? <CutLine full={Boolean(game.fillPlayers)} /> : null}
			{index === pagesLength - 1 ? (
				<div className={styles.pageBreak} />
			) : null}
		</div>
	);
};

const GameCard = forwardRef<
	HTMLDivElement,
	{
		games: ChampionshipGame[];
		title: string;
		season: string;
		ctx: CardContext;
	}
>(function GameCard({ games, title, season, ctx }, ref) {
	const pages = pagesFor(games, ctx);
	return (
		<div ref={ref} className={styles.printRoot}>
			{pages.map((page, pageIndex) => (
				<div key={page.map((game) => game.id).join("-") || pageIndex}>
					{page.map((game, index) => (
						<GameSheet
							key={`${game.id}-${game.page || index}`}
							game={game}
							index={index}
							title={title}
							season={season}
							ctx={ctx}
							pagesLength={page.length}
						/>
					))}
				</div>
			))}
		</div>
	);
});

export default GameCard;
