"use client";

import { useCallback } from "react";
import { useDataHandlerSecure } from "@repo/provider";
import { ChampionshipClass } from "@repo/types";

const useChampionshipUpdate = (
	objectId: string,
	refetch: () => Promise<unknown>
) => {
	const { updateData, loading } = useDataHandlerSecure();

	const onUpdate = useCallback(
		async (patch: Partial<ChampionshipClass>, feedback?: string) => {
			if (!objectId) {
				return;
			}
			await updateData({
				className: "Championship",
				objectId,
				updateObject: patch,
				feedback: feedback || "Meisterschaft aktualisiert"
			});
			await refetch();
		},
		[objectId, refetch, updateData]
	);

	return { onUpdate, loading };
};

export default useChampionshipUpdate;
