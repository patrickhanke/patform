"use client";

import { useCallback } from "react";
import { useDataHandlerSecure } from "@repo/provider";
import { CompetitionClass } from "@repo/types";

const useCompetitionUpdate = (
	objectId: string,
	refetch: () => Promise<unknown>
) => {
	const { updateData, loading } = useDataHandlerSecure();

	const onUpdate = useCallback(
		async (patch: Partial<CompetitionClass>, feedback?: string) => {
			if (!objectId) {
				return;
			}
			await updateData({
				className: "Competition",
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

export default useCompetitionUpdate;
