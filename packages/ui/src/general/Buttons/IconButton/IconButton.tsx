import { IconButtonProps } from "./types";
import Link from "next/link";
import Icons from "./Icons";
import { FC } from "react";
import { Button } from "@chakra-ui/react";

const IconButton: FC<IconButtonProps> = ({
	icon,
	isLink,
	isBlank,
	link,
	onClick,
	disabled,
	text,
	size = 12,
	color,
	loading = false,
	type = "button"
}) => {
	if (!isLink && onClick)
		return (
			<Button
				type={type}
				onClick={() => onClick()}
				variant="subtle"
				size="2xs"
				scale={0.9}
				disabled={disabled}
				color={color}
				loading={loading}
				style={{ transformOrigin: "center", height: "auto" }}
				padding={text ? "auto" : "8px"}
			>
				<Icons icon={icon} />
				{text}
			</Button>
		);

	if (isLink && link)
		return (
			<Button
				type="button"
				onClick={() => null}
				variant="subtle"
				size="2xs"
				// scale={0.9}
				disabled={disabled}
				color={color}
				asChild
			>
				<Link
					href={link}
					target={isBlank ? "_blank" : "_self"}
					style={{ fontSize: size }}
				>
					<Icons icon={icon} />
					{text}
				</Link>
			</Button>
		);

	return null;
};

export default IconButton;
