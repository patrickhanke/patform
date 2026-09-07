"use client";

import { ActionBar, Portal } from "@chakra-ui/react";
import { FC } from "react";
import { IconButton } from "@repo/ui";

export type ContentEditorActionBarProps = {
	open: boolean;
	onSave: () => void;
	onReset: () => void;
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
};

const ContentEditorActionBar: FC<ContentEditorActionBarProps> = ({
	open,
	onSave,
	onReset,
	onUndo,
	onRedo,
	canUndo,
	canRedo
}) => {
	return (
		<ActionBar.Root open={open}>
			<Portal>
				<ActionBar.Positioner zIndex={12}>
					<ActionBar.Content>
						<ActionBar.SelectionTrigger>
							Daten geändert
						</ActionBar.SelectionTrigger>
						<ActionBar.Separator />
						<IconButton
							icon="save"
							text="Speichern"
							color="dark"
							onClick={onSave}
						/>
						<ActionBar.Separator />
						<IconButton
							icon="refresh"
							text="Verwerfen"
							onClick={onReset}
						/>
						<ActionBar.Separator />
						<IconButton
							icon="undo"
							tooltip="Rückgängig"
							onClick={onUndo}
							disabled={!canUndo}
						/>
						<IconButton
							icon="redo"
							tooltip="Wiederholen"
							onClick={onRedo}
							disabled={!canRedo}
						/>
					</ActionBar.Content>
				</ActionBar.Positioner>
			</Portal>
		</ActionBar.Root>
	);
};

export default ContentEditorActionBar;
