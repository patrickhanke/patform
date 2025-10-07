"use client";

import { ActionBar, Button, Portal } from "@chakra-ui/react";
import { FC } from "react";
import { LuShare } from "react-icons/lu";
import { FormActionBarProps } from "../types";

const FormActionBar: FC<FormActionBarProps> = ({
	open,
	setOpen,
	handleSubmit,
	resetForm
}) => {
	const submitHandler = () => {
		handleSubmit();
		setOpen(false);
	};

	const resetHandler = () => {
		resetForm();
		setOpen(false);
	};

	return (
		<ActionBar.Root open={open}>
			<Portal>
				<ActionBar.Positioner zIndex={12}>
					<ActionBar.Content>
						<ActionBar.SelectionTrigger>
							Daten geändert
						</ActionBar.SelectionTrigger>
						<ActionBar.Separator />
						<Button
							variant="solid"
							// color="white"
							colorPalette={"green"}
							size="2xs"
							onClick={submitHandler}
						>
							<LuShare />
							Speichern
						</Button>
						<ActionBar.Separator />
						<Button
							variant="solid"
							background={"gray"}
							color="dark"
							size="2xs"
							onClick={resetHandler}
						>
							Verwerfen
						</Button>
					</ActionBar.Content>
				</ActionBar.Positioner>
			</Portal>
		</ActionBar.Root>
	);
};

export default FormActionBar;
