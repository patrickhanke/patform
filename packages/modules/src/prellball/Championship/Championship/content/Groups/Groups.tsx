"use client";

import { FC } from "react";
import { CreateButton, usePageData } from "@repo/ui";
import { ChampionshipGroup } from "@repo/types";
import { ChampionshipPageModel, ChampionshipTabProps } from "../../../types";
import GroupCard from "./components/GroupCard";

const createGroup = (index: number): ChampionshipGroup => ({
	id: crypto.randomUUID(),
	name: `Gruppe ${index}`,
	mode: "gruppe",
	color: "#1f6feb",
	subgroups: []
});

const Groups: FC<ChampionshipTabProps> = ({ related }) => {
	const { data: page, setData } = usePageData<ChampionshipPageModel>();
	if (!page) return null;

	const replaceGroup = (group: ChampionshipGroup) => {
		setData(
			"data.groups",
			page.data.groups.map((item) =>
				item.id === group.id ? group : item
			)
		);
	};

	return (
		<div className="flex col a-st gap-md">
			<h2>Gruppen</h2>
			{page.data.groups.map((group) => (
				<GroupCard
					key={group.id}
					group={group}
					page={page}
					related={related}
					onChange={replaceGroup}
					onDelete={() =>
						setData(
							"data.groups",
							page.data.groups.filter(
								(item) => item.id !== group.id
							)
						)
					}
				/>
			))}
			<CreateButton
				text="Gruppe hinzufügen"
				size="medium"
				onClick={() =>
					setData("data.groups", [
						...page.data.groups,
						createGroup(page.data.groups.length + 1)
					])
				}
			/>
		</div>
	);
};

export default Groups;
