"use client";

import { ActionBar, Button, Checkbox, Portal } from "@chakra-ui/react";
import { FC } from "react";
import { LuShare } from "react-icons/lu";
import { ActionBarProps } from "./types";

const ActionBarComponent: FC<ActionBarProps> = ({ open, setOpen }) => {
	return (
		<ActionBar.Root open={open}>
			<Portal>
				<ActionBar.Positioner>
					<ActionBar.Content>
						<ActionBar.SelectionTrigger>
							Daten geändert
						</ActionBar.SelectionTrigger>
						<ActionBar.Separator />
						<Button variant="outline" size="sm">
							<LuShare />
							Speichern
						</Button>
					</ActionBar.Content>
				</ActionBar.Positioner>
			</Portal>
		</ActionBar.Root>
	);
};

export default ActionBarComponent;
