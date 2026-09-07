"use client";

import { FC } from "react";
import { formatCents } from "../functions/format";

const MoneyCell: FC<{
	cents: number | null | undefined;
	currency?: string;
	bold?: boolean;
	colored?: boolean;
}> = ({ cents, currency = "EUR", bold = false, colored = true }) => {
	const value = cents ?? 0;
	const color = !colored
		? undefined
		: value < 0
			? "#b91c1c"
			: value > 0
				? "#15803d"
				: undefined;

	return (
		<span
			style={{
				color,
				fontWeight: bold ? 700 : 500,
				fontVariantNumeric: "tabular-nums",
				whiteSpace: "nowrap"
			}}
		>
			{formatCents(value, currency)}
		</span>
	);
};

export default MoneyCell;
