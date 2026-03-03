import React from "react";
import { Alert } from "@chakra-ui/react";

type InfoBoxComponent = {
	content?: () => React.ReactElement;
	text?: string;
	status?: "info" | "success" | "warning" | "error";
	maxWidth?: string;
};

const InfoBox = ({
	content,
	text,
	status = "info",
	maxWidth = "500px"
}: InfoBoxComponent) => (
	<Alert.Root status={status} maxWidth={maxWidth}>
		<Alert.Indicator />
		<Alert.Title fontSize="xs">
			{content && content()}
			{text && text}
		</Alert.Title>
	</Alert.Root>
);

export default InfoBox;
