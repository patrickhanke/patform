"use client";

import { FC, useState } from "react";
import { TextInput } from "@repo/ui";
import { CompetitionGame } from "@repo/types";

const CompetitionScoreCell: FC<{
	game: CompetitionGame;
	disabled?: boolean;
	onChange: (patch: Pick<CompetitionGame, "score1" | "score2">) => void;
}> = ({ game, disabled, onChange }) => {
	const [score1, setScore1] = useState(String(game.score1 ?? ""));
	const [score2, setScore2] = useState(String(game.score2 ?? ""));

	const commit = (next1: string, next2: string) => {
		const parsed1 = next1 === "" ? null : Number(next1);
		const parsed2 = next2 === "" ? null : Number(next2);
		onChange({
			score1: parsed1 != null && Number.isNaN(parsed1) ? null : parsed1,
			score2: parsed2 != null && Number.isNaN(parsed2) ? null : parsed2
		});
	};

	return (
		<div className="flex row a-ce gap-sm">
			<TextInput
				id={`${game.id}-score1`}
				type="number"
				defaultValue={score1}
				disabled={disabled}
				width={70}
				onChange={(value) => {
					setScore1(value);
					commit(value, score2);
				}}
			/>
			<span>:</span>
			<TextInput
				id={`${game.id}-score2`}
				type="number"
				defaultValue={score2}
				disabled={disabled}
				width={70}
				onChange={(value) => {
					setScore2(value);
					commit(score1, value);
				}}
			/>
		</div>
	);
};

export default CompetitionScoreCell;
