"use client";

import { useCallback, useMemo } from "react";
import { useDataHandlerSecure } from "@repo/provider";
import {
	ChampionshipClass,
	ChampionshipSignup,
	ClubClass
} from "@repo/types";
import { createSignup } from "../../../Championship/ChampionshipDetail/functions/factories";
import { ClubSignupRow } from "../types";

const useClubSignups = (
	club: ClubClass | null,
	championships: ChampionshipClass[],
	refetchChampionships: () => Promise<unknown>
) => {
	const { updateData, loading } = useDataHandlerSecure();

	const rows: ClubSignupRow[] = useMemo(() => {
		if (!club) {
			return [];
		}
		return championships.flatMap((championship) =>
			(championship.signups || [])
				.filter((signup) => signup.entryId === club.objectId)
				.map((signup) => ({
					...signup,
					objectId: signup.id,
					championshipId: championship.objectId,
					championshipTitle: championship.title,
					championshipSeason: championship.season,
					championshipDeadline: championship.deadline,
					championshipOpenSignup: championship.open_signup,
					championshipFreeSignup: championship.free_signup,
					championshipClasses: championship.classes || []
				}))
		);
	}, [championships, club]);

	const writeSignups = useCallback(
		async (
			championshipId: string,
			signups: ChampionshipSignup[],
			feedback: string
		) => {
			await updateData({
				className: "Championship",
				objectId: championshipId,
				updateObject: { signups },
				feedback
			});
			await refetchChampionships();
		},
		[refetchChampionships, updateData]
	);

	const patchSignup = useCallback(
		async (
			championshipId: string,
			signupId: string,
			patch: Partial<ChampionshipSignup>,
			feedback: string
		) => {
			const championship = championships.find(
				(item) => item.objectId === championshipId
			);
			if (!championship) {
				return;
			}
			await writeSignups(
				championshipId,
				(championship.signups || []).map((signup) =>
					signup.id === signupId ? { ...signup, ...patch } : signup
				),
				feedback
			);
		},
		[championships, writeSignups]
	);

	const createOpenSignup = useCallback(
		async (championshipId: string, classValue: string) => {
			if (!club) {
				return;
			}
			const championship = championships.find(
				(item) => item.objectId === championshipId
			);
			if (!championship) {
				return;
			}
			const sameClub = (championship.signups || []).filter(
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
				championshipId,
				[...(championship.signups || []), signup],
				"Offene Meldung hinzugefügt"
			);
		},
		[championships, club, writeSignups]
	);

	const deleteSignup = useCallback(
		async (championshipId: string, signupId: string) => {
			const championship = championships.find(
				(item) => item.objectId === championshipId
			);
			if (!championship) {
				return;
			}
			await writeSignups(
				championshipId,
				(championship.signups || []).filter(
					(signup) => signup.id !== signupId
				),
				"Meldung gelöscht"
			);
		},
		[championships, writeSignups]
	);

	const openChampionships = useMemo(
		() =>
			championships.filter(
				(championship) => championship.open_signup
			),
		[championships]
	);

	return {
		rows,
		loading,
		patchSignup,
		createOpenSignup,
		deleteSignup,
		openChampionships
	};
};

export default useClubSignups;
