"use client";

import { useCallback, useMemo } from "react";
import { useDataHandlerSecure } from "@repo/provider";
import {
	CompetitionClass,
	CompetitionSignup,
	ClubClass
} from "@repo/types";
import { createSignup } from "../../../Competition/CompetitionDetail/functions/factories";
import { ClubSignupRow } from "../types";

const useClubSignups = (
	club: ClubClass | null,
	competitions: CompetitionClass[],
	refetchCompetitions: () => Promise<unknown>
) => {
	const { updateData, loading } = useDataHandlerSecure();

	const rows: ClubSignupRow[] = useMemo(() => {
		if (!club) {
			return [];
		}
		return competitions.flatMap((competition) =>
			(competition.signups || [])
				.filter((signup) => signup.entryId === club.objectId)
				.map((signup) => ({
					...signup,
					objectId: signup.id,
					competitionId: competition.objectId,
					competitionTitle: competition.title,
					competitionSeason: competition.season,
					competitionDeadline: competition.deadline,
					competitionOpenSignup: competition.open_signup,
					competitionFreeSignup: competition.free_signup,
					competitionClasses: competition.classes || []
				}))
		);
	}, [competitions, club]);

	const writeSignups = useCallback(
		async (
			competitionId: string,
			signups: CompetitionSignup[],
			feedback: string
		) => {
			await updateData({
				className: "Competition",
				objectId: competitionId,
				updateObject: { signups },
				feedback
			});
			await refetchCompetitions();
		},
		[refetchCompetitions, updateData]
	);

	const patchSignup = useCallback(
		async (
			competitionId: string,
			signupId: string,
			patch: Partial<CompetitionSignup>,
			feedback: string
		) => {
			const competition = competitions.find(
				(item) => item.objectId === competitionId
			);
			if (!competition) {
				return;
			}
			await writeSignups(
				competitionId,
				(competition.signups || []).map((signup) =>
					signup.id === signupId ? { ...signup, ...patch } : signup
				),
				feedback
			);
		},
		[competitions, writeSignups]
	);

	const createOpenSignup = useCallback(
		async (competitionId: string, classValue: string) => {
			if (!club) {
				return;
			}
			const competition = competitions.find(
				(item) => item.objectId === competitionId
			);
			if (!competition) {
				return;
			}
			const sameClub = (competition.signups || []).filter(
				(signup) =>
					signup.entryId === club.objectId &&
					signup.class === classValue
			);
			const signup = createSignup({
				entryId: club.objectId,
				class: classValue || undefined,
				number: sameClub.length + 1,
				status: "eingeladen",
				active: true,
				openSignup: true
			});
			await writeSignups(
				competitionId,
				[...(competition.signups || []), signup],
				"Offene Meldung hinzugefügt"
			);
		},
		[competitions, club, writeSignups]
	);

	const deleteSignup = useCallback(
		async (competitionId: string, signupId: string) => {
			const competition = competitions.find(
				(item) => item.objectId === competitionId
			);
			if (!competition) {
				return;
			}
			await writeSignups(
				competitionId,
				(competition.signups || []).filter(
					(signup) => signup.id !== signupId
				),
				"Meldung gelöscht"
			);
		},
		[competitions, writeSignups]
	);

	const openCompetitions = useMemo(
		() => competitions.filter((competition) => competition.open_signup),
		[competitions]
	);

	return {
		rows,
		loading,
		patchSignup,
		createOpenSignup,
		deleteSignup,
		openCompetitions
	};
};

export default useClubSignups;
