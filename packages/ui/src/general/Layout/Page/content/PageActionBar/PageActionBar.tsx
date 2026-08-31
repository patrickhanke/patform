"use client";

import { ActionBar, Portal } from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { PageActionBarProps } from "./types";
import { IconButton } from "@repo/ui";
import usePageData from "../../hooks/usePageData";
import { useDataHandlerSecure } from "@repo/provider";

const PageActionBar: FC<PageActionBarProps> = ({
	open,
	updateOptions,
	objectId,
	resetData,
	undoData,
	redoData,
	refetch
}) => {
	const [isSaving, setIsSaving] = useState(false);
	const { updateData } = useDataHandlerSecure(
		updateOptions?.useMasterKey ?? false
	);
	const { prepareData, prepareCollectionUpdates, commitData } = usePageData();

	const canSave = Boolean(
		updateOptions && (objectId || updateOptions.collection)
	);

	const handleSave = useCallback(async () => {
		if (!updateOptions) return;
		if (!updateOptions.collection && !objectId) return;

		setIsSaving(true);
		try {
			if (updateOptions.collection) {
				const updates = prepareCollectionUpdates();
				if (updates.length > 0) {
					await Promise.all(
						updates.map((item, index) =>
							updateData({
								className: updateOptions.className,
								objectId: item.objectId,
								updateObject: item.updateObject,
								feedback:
									index === 0
										? updateOptions.message
										: undefined
							})
						)
					);
				}
			} else {
				const currentData = prepareData();
				if (currentData == null || !objectId) return;

				await updateData({
					className: updateOptions.className,
					objectId,
					updateObject: updateOptions.updateObject(currentData),
					feedback: updateOptions.message
				});
			}
			commitData();
			if (refetch) {
				await refetch();
			}
		} finally {
			setIsSaving(false);
		}
	}, [
		commitData,
		objectId,
		prepareCollectionUpdates,
		prepareData,
		updateData,
		updateOptions,
		refetch
	]);

	const resetHandler = () => {
		resetData();
	};

	return (
		<ActionBar.Root open={open}>
			<Portal>
				<ActionBar.Positioner zIndex={12}>
					<ActionBar.Content>
						<ActionBar.SelectionTrigger>
							{isSaving ? "Speichern..." : "Daten geändert"}
						</ActionBar.SelectionTrigger>
						<ActionBar.Separator />
						<IconButton
							icon="save"
							text="Speichern"
							color="dark"
							onClick={handleSave}
							loading={isSaving}
							disabled={!canSave}
						/>

						<ActionBar.Separator />
						<IconButton
							icon="refresh"
							text="Verwerfen"
							onClick={resetHandler}
							loading={isSaving}
						/>
						<ActionBar.Separator />

						<IconButton
							icon="undo"
							onClick={undoData}
							disabled={!undoData}
							loading={isSaving}
						/>
						<IconButton
							icon="redo"
							onClick={redoData}
							disabled={!redoData}
							loading={isSaving}
						/>
					</ActionBar.Content>
				</ActionBar.Positioner>
			</Portal>
		</ActionBar.Root>
	);
};

export default PageActionBar;
