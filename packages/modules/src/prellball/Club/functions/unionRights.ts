import { axiosclient } from "@repo/provider";
import { PrellballClubClass } from "@repo/types";

/**
 * Asks the cloud to match the per-user page grants of the club modules to the
 * unions. Users that may open a primary club get access to its union, grants
 * that are no longer legitimate are removed.
 */
export const checkUnionRights = async () => {
	try {
		await axiosclient().post("functions/check_union_rights", {});
	} catch (error) {
		console.error("check_union_rights failed", error);
	}
};

/** True when the primary club of the union differs from the saved one. */
export const primaryClubChanged = (
	saved: PrellballClubClass | null,
	next: PrellballClubClass
) =>
	(saved?.settings?.primary_club_id || "") !==
	(next.settings?.primary_club_id || "");
