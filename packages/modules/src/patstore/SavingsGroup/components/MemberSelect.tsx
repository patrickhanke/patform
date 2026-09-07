"use client";

import { FC } from "react";
import { Select } from "@repo/ui";
import { SavingsGroupMember } from "@repo/types";
import { memberDisplayName } from "../functions/format";
import { pocketSort } from "../functions/calc";

const MemberSelect: FC<{
	members: SavingsGroupMember[];
	value: string | null;
	onChange: (personId: string | null) => void;
	label?: string;
	placeholder?: string;
	subtitle?: (member: SavingsGroupMember) => string;
	width?: number | string;
}> = ({
	members,
	value,
	onChange,
	label = "Sparfach",
	placeholder = "Sparfach wählen…",
	subtitle,
	width = 280
}) => {
	const options = [...members]
		.sort((a, b) => pocketSort(a.sparfach, b.sparfach))
		.map((member) => ({
			value: member.personId,
			label: [
				member.sparfach || "–",
				memberDisplayName(member, true) || "(ohne Namen)",
				subtitle ? subtitle(member) : ""
			]
				.filter(Boolean)
				.join(" · ")
		}));

	return (
		<Select
			id="savings-group-member"
			label={label}
			placeholder={placeholder}
			width={width}
			isClearable
			value={value}
			options={options}
			onChange={(option: { value?: string } | null) =>
				onChange(option?.value ? String(option.value) : null)
			}
		/>
	);
};

export default MemberSelect;
