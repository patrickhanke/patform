import { IconButtonColor, IconButtonProps } from "./types";
import Link from "next/link";
import Icons from "./Icons";
import { FC } from "react";
import { Button } from "@chakra-ui/react";
import { getIconButtonColorProps } from "./getIconButtonColorProps";
import { Tooltip } from "@repo/ui";

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
	type = "button",
	tooltip
}) => {
	const colorProps = getIconButtonColorProps(color as IconButtonColor);

	if (!isLink && onClick)
		return (
			<Tooltip
				showArrow={!!tooltip}
				portalled
				content={tooltip}
				disabled={disabled}
				contentProps={{
					display: tooltip ? "block" : "none"
				}}
			>
				<Button
					type={type}
					onClick={() => onClick()}
					size="2xs"
					scale={0.9}
					disabled={disabled}
					loading={loading}
					{...colorProps}
					style={{
						transformOrigin: "center",
						height: "auto",
						fontSize: size
					}}
					padding={text ? "6px 12px" : "8px"}
				>
					{icon && <Icons icon={icon} size={size} />}
					{text}
				</Button>
			</Tooltip>
		);

	if (isLink && link)
		return (
			<Tooltip showArrow portalled content={tooltip}>
				<Button
					type="button"
					onClick={() => null}
					size="2xs"
					disabled={disabled}
					asChild
					{...colorProps}
				>
					<Link
						href={link}
						target={isBlank ? "_blank" : "_self"}
						style={{ fontSize: size }}
					>
						{icon && <Icons icon={icon} size={size} />}
						{text}
					</Link>
				</Button>
			</Tooltip>
		);

	return null;
};

export default IconButton;
