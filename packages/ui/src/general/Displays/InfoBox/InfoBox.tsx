import React from "react";
import { Alert } from "@chakra-ui/react";

type InfoBoxComponent = {
	content?: () => React.ReactElement;
	text?: string;
	status?: "info" | "success" | "warning" | "error";
	maxWidth?: string;
	noMargin?: boolean;
};

const InfoBox = ({
	content,
	text,
	status = "info",
	maxWidth = "500px",
	noMargin = false
}: InfoBoxComponent) => (
	<Alert.Root
		status={status}
		maxWidth={maxWidth}
		marginBottom={noMargin ? "0px" : "12px"}
		padding="6px"
	>
		<Alert.Indicator />
		<Alert.Title fontSize="xs">
			{content && content()}
			{text && text}
		</Alert.Title>
	</Alert.Root>
);

export default InfoBox;
