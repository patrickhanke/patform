"use client";

import { FC } from "react";
import { StateDisplayProps } from "./types";
import { Icon } from "@repo/ui";
import "./styles.scss";
import { Badge } from "@chakra-ui/react";

const StateDisplay: FC<StateDisplayProps> = ({
	label,
	color,
	icon,
	onClick,
	width
}) => {
	return (
		<Badge
			onClick={onClick}
			className="state_display_container"
			colorPalette={color}
			style={{
				width: width || "fit-content",
				cursor: onClick ? "pointer" : "default"
			}}
			data-click={!!onClick}
		>
			{icon && <Icon type={icon} size={12} />}
			{label}
		</Badge>
	);
};

export default StateDisplay;
