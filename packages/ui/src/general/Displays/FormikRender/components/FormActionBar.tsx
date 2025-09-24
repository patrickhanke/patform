"use client";

import { ActionBar, Button, Portal } from "@chakra-ui/react";
import { FC } from "react";
import { LuShare } from "react-icons/lu";
import { FormActionBarProps } from "../types";

const FormActionBar: FC<FormActionBarProps> = ({
	open,
	setOpen,
	handleSubmit
}) => {
	const submitHandler = () => {
		handleSubmit();
		setOpen(false);
	};

	return (
		<ActionBar.Root open={open}>
			<Portal>
				<ActionBar.Positioner>
					<ActionBar.Content>
						<ActionBar.SelectionTrigger>
							Daten geändert
						</ActionBar.SelectionTrigger>
						<ActionBar.Separator />
						<Button
							variant="outline"
							size="xs"
							onClick={submitHandler}
						>
							<LuShare />
							Speichern
						</Button>
					</ActionBar.Content>
				</ActionBar.Positioner>
			</Portal>
		</ActionBar.Root>
	);
};

export default FormActionBar;
