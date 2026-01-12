import React from "react";
import { Alert } from "@chakra-ui/react";

type InfoBoxComponent = {
	content?: () => React.ReactElement;
	text?: string;
	status?: "info" | "success" | "warning" | "error";
};

const InfoBox = ({ content, text, status = "info" }: InfoBoxComponent) => (
	<Alert.Root status={status}>
		<Alert.Indicator />
		<Alert.Title fontSize="xs">
			{content && content()}
			{text && text}
		</Alert.Title>
	</Alert.Root>
);

export default InfoBox;
