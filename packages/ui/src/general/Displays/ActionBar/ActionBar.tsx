"use client";

import { Box, Button, HStack, Portal, Text } from "@chakra-ui/react";
import { FC } from "react";
import { LuShare, LuX } from "react-icons/lu";
import { ActionBarProps } from "./types";

const ActionBarComponent: FC<ActionBarProps> = ({ open, onCancel, onSave }) => {
	if (!open) return null;

	return (
		<Portal>
			<Box
				position="fixed"
				bottom="4"
				left="50%"
				transform="translateX(-50%)"
				zIndex={1400}
				bg="bg.panel"
				borderWidth="1px"
				borderRadius="lg"
				shadow="lg"
				px="4"
				py="2"
			>
				<HStack gap="3">
					<Text fontSize="sm" fontWeight="medium">
						Daten geändert
					</Text>
					<Box w="1px" h="4" bg="border" />
					<Button
						variant="outline"
						size="xs"
						colorPalette="gray"
						onClick={onCancel}
					>
						<LuX />
						Abbrechen
					</Button>
					<Button
						variant="solid"
						size="xs"
						colorPalette="green"
						onClick={onSave}
					>
						<LuShare />
						Speichern
					</Button>
				</HStack>
			</Box>
		</Portal>
	);
};

export default ActionBarComponent;
