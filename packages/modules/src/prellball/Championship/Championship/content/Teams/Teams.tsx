"use client";

import { FC } from "react";
import { CreateButton, Divider, usePageData } from "@repo/ui";
import { ChampionshipSignUp } from "@repo/types";
import { useAppContext } from "@repo/provider";
import { ChampionshipPageModel, ChampionshipTabProps } from "@repo/modules";
import { divisionLabel, selectedDivisionIds } from "@repo/provider";
import { useDivisionCategories } from "@repo/provider";
import { clearSignupClub, createSignup, withoutSignup } from "@repo/provider";
import TeamRow from "./components/TeamRow";

const Teams: FC<ChampionshipTabProps> = ({ related }) => {
	const { project } = useAppContext();
	const divisions = useDivisionCategories(project?.objectId);
	const { data: page, setData } = usePageData<ChampionshipPageModel>();
	if (!page) return null;
	const divisionIds = selectedDivisionIds(page.categories, divisions);

	const allowSecondary = page.settings?.secondary_teams || false;

	const replaceSignup = (signup: ChampionshipSignUp) => {
		setData(
			"data.sign_ups",
			page.data.sign_ups.map((item) =>
				item.id === signup.id ? signup : item
			)
		);
	};

	if (divisionIds.length === 0) {
		return <p>Lege zuerst Divisionen in den Einstellungen fest.</p>;
	}

	return (
		<div
			className="flex col a-st j-sb gap-md "
			style={{ flexWrap: "wrap" }}
		>
			{divisionIds.map((division) => {
				const signups = page.data.sign_ups
					.filter((signup) => signup.division === division)
					.sort((a, b) => a.position - b.position);
				return (
					<div
						key={division}
						className="flex col a-st gap-sm content_element"
					>
						<h2>{divisionLabel(division, divisions)}</h2>
						{signups.map((signup) => (
							<TeamRow
								key={signup.id}
								signup={signup}
								page={page}
								related={related}
								allowSecondary={allowSecondary}
								onChange={replaceSignup}
								onDelete={() =>
									setData(
										"data",
										withoutSignup(page.data, signup.id)
									)
								}
								onClearClub={() =>
									setData(
										"data",
										clearSignupClub(page.data, signup.id)
									)
								}
							/>
						))}
						<Divider showLine={false} />
						<CreateButton
							text="Neue Meldung hinzufügen"
							size="small"
							onClick={() =>
								setData("data.sign_ups", [
									...page.data.sign_ups,
									createSignup(division, signups.length + 1)
								])
							}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default Teams;
