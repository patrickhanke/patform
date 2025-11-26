import React from "react";
import { Alert } from "@chakra-ui/react";

type InfoBoxComponent = {
	content?: () => React.ReactElement;
	text?: string;
};

const InfoBox = ({ content, text }: InfoBoxComponent) => (
	<Alert.Root status="info">
		<Alert.Indicator />
		<Alert.Title fontSize="xs">
			{content && content()}
			{text && text}
		</Alert.Title>
	</Alert.Root>
);

export default InfoBox;
