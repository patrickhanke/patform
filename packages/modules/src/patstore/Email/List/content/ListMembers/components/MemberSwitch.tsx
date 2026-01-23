"use client";

import { FC, useCallback, useState } from "react";
import { StateDisplay } from "@repo/ui";
import { useDataHandler, useDataHandlerSecure } from "@repo/provider";
import { ApolloRefetch } from "@repo/types";

export interface MemberSwitchProps {
	listId: string;
	lists: string[] | undefined;
	userId: string;
	refetch: ApolloRefetch;
}

const MemberSwitch: FC<MemberSwitchProps> = ({
	listId,
	lists,
	userId,
	refetch
}) => {
	const { updateData } = useDataHandlerSecure(true);
	const [isUpdating, setIsUpdating] = useState(false);

	const isInList = lists?.includes(listId) || false;

	const handleToggle = useCallback(async () => {
		if (isUpdating) return;

		setIsUpdating(true);

		try {
			// Create updated lists array
			let updatedLists: string[];

			if (isInList) {
				// Remove listId from lists
				updatedLists = (lists || []).filter((id) => id !== listId);
			} else {
				// Add listId to lists
				updatedLists = [...(lists || []), listId];
			}

			await updateData({
				className: "_User",
				objectId: userId,
				updateObject: {
					lists: updatedLists
				},
				feedback: isInList
					? "Benutzer aus Liste entfernt"
					: "Benutzer zur Liste hinzugefügt"
			});

			await refetch();
		} catch (error) {
			console.error("Error updating user lists:", error);
		} finally {
			setIsUpdating(false);
		}
	}, [listId, lists, userId, isInList, updateData, refetch, isUpdating]);

	return (
		<StateDisplay
			label={isInList ? "Ja" : "Nein"}
			color={isInList ? "green" : "red"}
			onClick={handleToggle}
		/>
	);
};

export default MemberSwitch;
