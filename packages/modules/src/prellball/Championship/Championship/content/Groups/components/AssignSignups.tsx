"use client";

import { FC, useEffect, useState } from "react";
import { ElementSelectInterface, SlideIn } from "@repo/ui";
import { SelectElement } from "@repo/ui";
import { ChampionshipGroup, ChampionshipSignUp } from "@repo/types";
import { ClubClass } from "@repo/types";
import { useAppContext } from "@repo/provider";
import { signupLabel } from "@repo/provider";
import { distinctClubSignups, signupTeamKey } from "@repo/provider";
import { useDivisionCategories } from "@repo/provider";

const AssignSignups: FC<{
	isOpen: boolean;
	group: ChampionshipGroup | null;
	groups: ChampionshipGroup[];
	signups: ChampionshipSignUp[];
	clubs: ClubClass[];
	projectId?: string;
	showClass: boolean;
	onClose: () => void;
	onSave: (group: ChampionshipGroup) => void;
}> = ({
	isOpen,
	group,
	groups,
	signups,
	clubs,
	projectId,
	showClass,
	onClose,
	onSave
}) => {
	const { project } = useAppContext();
	const divisions = useDivisionCategories(projectId || project?.objectId);
	const [draft, setDraft] = useState<ChampionshipGroup | null>(group);
	const [subgroupId, setSubgroupId] = useState("");

	useEffect(() => {
		if (!isOpen) return;
		setDraft(group ? structuredClone(group) : null);
		setSubgroupId(group?.subgroups[0]?.id || "");
	}, [isOpen, group]);

	if (!draft) {
		return (
			<SlideIn
				header="Meldungen"
				isOpen={isOpen}
				cancel={onClose}
				showConfirmButton={false}
			>
				<p />
			</SlideIn>
		);
	}

	const selected =
		draft.subgroups.find((subgroup) => subgroup.id === subgroupId)
			?.signup_ids || [];
	const assignedHere = new Set(
		draft.subgroups.flatMap((subgroup) => subgroup.signup_ids)
	);
	const takenElsewhere = new Set(
		groups
			.filter((item) => item.id !== draft.id)
			.flatMap((item) =>
				item.subgroups.flatMap((subgroup) => subgroup.signup_ids)
			)
	);
	const visibleSignups = distinctClubSignups(signups, divisions);
	const teamIds = (signupId: string) => {
		const signup = signups.find((item) => item.id === signupId);
		if (!signup) return [signupId];
		const key = signupTeamKey(signup, signups, divisions);
		return signups
			.filter(
				(item) =>
					item.club_id &&
					signupTeamKey(item, signups, divisions) === key
			)
			.map((item) => item.id);
	};
	const elements: SelectElement[] = visibleSignups.map((signup) => {
		const ids = teamIds(signup.id);
		return {
			value: signup.id,
			label: signupLabel(
				signup,
				visibleSignups,
				clubs,
				showClass,
				divisions
			),
			disabled:
				ids.some((id) => takenElsewhere.has(id)) &&
				!ids.some((id) => assignedHere.has(id))
		};
	});
	const selectedElements = elements.filter((element) =>
		teamIds(String(element.value)).some((id) => selected.includes(id))
	);

	const applySelection = (next: SelectElement[]) => {
		const ids = next
			.map((element) => element.value)
			.filter((value): value is string => Boolean(value));
		const covered = new Set(ids.flatMap((id) => teamIds(id)));
		setDraft((current) => {
			if (!current) return current;
			return {
				...current,
				subgroups: current.subgroups.map((subgroup) => {
					if (subgroup.id !== subgroupId) {
						return {
							...subgroup,
							signup_ids: subgroup.signup_ids.filter(
								(id) => !covered.has(id)
							)
						};
					}
					return { ...subgroup, signup_ids: ids };
				})
			};
		});
	};

	return (
		<SlideIn
			header={`${draft.name || "Gruppe"} – Meldungen`}
			isOpen={isOpen}
			cancel={onClose}
			confirm={() => onSave(draft)}
			confirmText="Übernehmen"
			disabled={[false, draft.subgroups.length === 0]}
		>
			<div className="flex col a-st gap-sm">
				{draft.subgroups.length === 0 ? (
					<p>Lege zuerst eine Untergruppe an.</p>
				) : (
					<>
						<div className="flex row a-ce j-sb gap-sm">
							<label htmlFor="group_select">Untergruppe</label>
							<select
								id="group_select"
								value={subgroupId}
								onChange={(event) =>
									setSubgroupId(event.target.value)
								}
							>
								{draft.subgroups.map((subgroup) => (
									<option
										key={subgroup.id}
										value={subgroup.id}
									>
										{subgroup.label}
									</option>
								))}
							</select>
						</div>
						<ElementSelectInterface
							elements={elements}
							selectedElements={selectedElements}
							onSelect={applySelection}
							max={Math.max(elements.length + 1, 1)}
							isSearchable
							setSelectedToTop
						/>
					</>
				)}
			</div>
		</SlideIn>
	);
};

export default AssignSignups;
