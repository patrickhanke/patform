"use client";

import { CSSProperties, FC, ReactNode } from "react";

const DARK = "#0a0417";
const GREY = "#c4c4c4";

const borderValue = (value?: string) => {
	if (value === "light") return `0.01cm solid ${GREY}`;
	if (value === "regular") return `0.01cm solid ${DARK}`;
	return "none";
};

const labelPosition = (position?: string): CSSProperties => {
	if (position === "bottom") return { bottom: "0.02cm" };
	if (position === "top-out") return { top: "-0.1cm" };
	if (position === "bottom-out") return { bottom: "-0.36cm" };
	return { top: "0.02cm" };
};

export type CardCell = {
	id?: string;
	width?: number;
	label?: string;
	position?: string;
	hasSmallHeight?: boolean;
	borderLeft?: string;
	borderRight?: string;
	borderTop?: string;
	borderBottom?: string;
	content?: string;
	height?: string;
	centerContent?: boolean;
	bottomContent?: boolean;
	hasLabel?: boolean;
};

const GameCardBox: FC<{
	cell: CardCell;
	children?: ReactNode;
}> = ({ cell, children }) => {
	const showLabel = Boolean(cell.hasLabel || cell.label);
	return (
		<div
			style={{
				width: `${cell.width ?? 5}cm`,
				borderLeft: borderValue(cell.borderLeft),
				borderRight: borderValue(cell.borderRight),
				borderTop: borderValue(cell.borderTop),
				borderBottom: borderValue(cell.borderBottom),
				height: cell.height || (cell.hasSmallHeight ? ".4cm" : ".7cm"),
				display: "flex",
				padding: ".05cm",
				position: "relative",
				flexDirection: "column",
				alignItems: cell.centerContent ? "center" : "flex-start",
				justifyContent: cell.bottomContent ? "flex-end" : "center",
				boxSizing: "border-box"
			}}
		>
			{showLabel ? (
				<p
					style={{
						fontSize: "10px",
						margin: 0,
						position: "absolute",
						left: ".02cm",
						...labelPosition(cell.position)
					}}
				>
					{cell.label}
				</p>
			) : null}
			{children}
		</div>
	);
};

export default GameCardBox;
