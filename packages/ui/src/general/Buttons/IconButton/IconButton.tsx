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
				style={{
					transformOrigin: "center",
					height: "auto",
					fontSize: size
				}}
				padding={text ? "6px 12px" : "8px"}
			>
				{icon && (
					<Icons
						icon={icon}
						size={size}
						color={typeof color === "string" ? color : undefined}
					/>
				)}
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
					{icon && (
						<Icons
							icon={icon}
							size={size}
							color={
								typeof color === "string" ? color : undefined
							}
						/>
					)}
					{text}
				</Link>
			</Button>
		);

	return null;
};

export default IconButton;
