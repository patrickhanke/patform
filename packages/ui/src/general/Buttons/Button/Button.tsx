import { ButtonProps } from "./types";
import Link from "next/link";
import { FC, useMemo } from "react";
import { Button as ChakraButton } from "@chakra-ui/react";

const truncateText = (
	text: string | undefined,
	maxWidth: number,
	fontSize: number,
	padding: number = 24
): string => {
	if (!text || typeof text !== "string") return "";
	// Estimate average character width as ~0.6 of font size
	const avgCharWidth = fontSize * 0.5;
	const availableWidth = maxWidth - padding;
	const maxChars = Math.floor(availableWidth / avgCharWidth);

	if (text.length <= maxChars) return text;
	if (maxChars <= 3) return "...";
	return text.slice(0, maxChars - 3) + "...";
};

const Button: FC<ButtonProps> = ({
	maxWidth = 120,
	minWidth = 120,
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
	styles = {}
}) => {
	const displayText = useMemo(
		() => truncateText(text, maxWidth, size),
		[text, maxWidth, size]
	);
	if (!isLink && onClick)
		return (
			<ChakraButton
				style={styles}
				maxW={maxWidth}
				minW={minWidth}
				type={type}
				onClick={() => onClick()}
				variant="subtle"
				size="xs"
				// scale={0.9}
				disabled={disabled}
				color={color}
				loading={loading}
				// style={{ transformOrigin: "center", height: "auto" }}
				padding={text ? "6px 12px" : "8px"}
				title={text}
			>
				{displayText}
			</ChakraButton>
		);

	if (isLink && link)
		return (
			<ChakraButton
				maxW={maxWidth}
				minW={minWidth}
				type="button"
				onClick={() => null}
				variant="subtle"
				size="xs"
				// scale={0.9}
				disabled={disabled}
				color={color}
				asChild
				title={text}
			>
				<Link
					href={link}
					target={isBlank ? "_blank" : "_self"}
					style={{ fontSize: size }}
				>
					{displayText}
				</Link>
			</ChakraButton>
		);

	return null;
};

export default Button;
