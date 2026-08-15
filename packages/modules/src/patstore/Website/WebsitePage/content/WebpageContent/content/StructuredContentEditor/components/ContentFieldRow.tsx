"use client";

import { Box, Field } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

type ContentFieldRowProps = {
	id: string;
	label: string;
	labelWidth?: string;
	children: ReactNode;
};

const ContentFieldRow: FC<ContentFieldRowProps> = ({
	id,
	label,
	labelWidth = "220px",
	children
}) => (
	<Field.Root
		display="flex"
		flexDirection={{ base: "column", md: "row" }}
		alignItems={{ base: "stretch", md: "flex-start" }}
		justifyContent="space-between"
		gap={4}
		w="full"
	>
		<Field.Label
			htmlFor={id}
			minW={{ md: labelWidth }}
			flexShrink={0}
			pt={{ md: 2 }}
			mb={0}
			fontWeight="medium"
		>
			{label}
		</Field.Label>
		<Box flex="1" minW="0" w="full">
			{children}
		</Box>
	</Field.Root>
);

export default ContentFieldRow;
