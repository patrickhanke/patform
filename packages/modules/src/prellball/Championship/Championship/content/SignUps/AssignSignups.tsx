"use client";

import { FC, useEffect, useState } from "react";
import { SlideIn } from "@repo/ui";
import { ChampionshipGroup, ChampionshipSignUp } from "@repo/types";
import { ClubClass } from "@repo/types";
import { useAppContext } from "@repo/provider";
import { signupLabel } from "../../../functions/signups";
import useDivisionCategories from "../../../../hooks/useDivisionCategories";

const AssignSignups: FC<{
	isOpen: boolean;
	group: ChampionshipGroup | null;
	signups: ChampionshipSignUp[];
	clubs: ClubClass[];
	showClass: boolean;
	onClose: () => void;
	onSave: (group: ChampionshipGroup) => void;
}> = ({ isOpen, group, signups, clubs, showClass, onClose, onSave }) => {
	const { project } = useAppContext();
	const divisions = useDivisionCategories(project?.objectId);
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

	const toggle = (signupId: string, checked: boolean) => {
		setDraft((current) => {
			if (!current) return current;
			return {
				...current,
				subgroups: current.subgroups.map((subgroup) => {
					const without = subgroup.signup_ids.filter(
						(id) => id !== signupId
					);
					if (subgroup.id !== subgroupId) {
						return { ...subgroup, signup_ids: without };
					}
					return {
						...subgroup,
						signup_ids: checked ? [...without, signupId] : without
					};
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
					<label>
						Untergruppe
						<select
							value={subgroupId}
							onChange={(event) =>
								setSubgroupId(event.target.value)
							}
						>
							{draft.subgroups.map((subgroup) => (
								<option key={subgroup.id} value={subgroup.id}>
									{subgroup.label}
								</option>
							))}
						</select>
					</label>
				)}
				{signups
					.filter((signup) => signup.club_id)
					.map((signup) => (
						<label key={signup.id} className="flex row a-ce gap-sm">
							<input
								type="checkbox"
								checked={selected.includes(signup.id)}
								disabled={!subgroupId}
								onChange={(event) =>
									toggle(signup.id, event.target.checked)
								}
							/>
							{signupLabel(
								signup,
								signups,
								clubs,
								showClass,
								divisions
							)}
						</label>
					))}
			</div>
		</SlideIn>
	);
};

export default AssignSignups;
