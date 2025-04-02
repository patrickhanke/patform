"use client";

import { FC } from "react";
import { StateDisplayProps } from "./types";
import { Icon } from "@repo/ui";
import "./styles.scss";

const StateDisplay: FC<StateDisplayProps> = ({
	label,
	color,
	icon,
	onClick,
	width
}) => {
	return (
		<div
			onClick={onClick}
			className="state_display_container"
			data-color={color}
			style={{ width: width || "fit-content" }}
			data-click={!!onClick}
		>
			{icon && <Icon type={icon} size={12} />}
			{label}
		</div>
	);
};

export default StateDisplay;
