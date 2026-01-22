"use client";

import { FC } from "react";
import { StatelessToggle } from "@repo/ui";

interface FilterItem {
	key: string;
	value: boolean;
}

interface ListSettings {
	static_list?: boolean;
	filters?: FilterItem[];
}

interface ListDynamicFilterProps {
	settings: ListSettings;
	updateSettings: (settings: ListSettings) => Promise<void>;
	loading: boolean;
}

const ListDynamicFilter: FC<ListDynamicFilterProps> = ({
	settings,
	updateSettings,
	loading
}) => {
	const filters = settings.filters || [];
	const newsletterOptinFilter = filters.find(
		(filter) => filter.key === "newsletter_optin"
	);
	const newsletterOptinValue = newsletterOptinFilter?.value ?? true;

	const handleNewsletterOptinChange = (value: boolean) => {
		const updatedFilters = filters.filter(
			(filter) => filter.key !== "newsletter_optin"
		);
		updatedFilters.push({ key: "newsletter_optin", value });

		updateSettings({ filters: updatedFilters });
	};

	return (
		<div className="flex col a-st gap-md">
			<h3>Dynamische Filter-Einstellungen</h3>
			<p>
				Die folgenden Filter bestimmen, welche Benutzer automatisch in
				diese Liste aufgenommen werden.
			</p>

			<div className="flex row a-ce j-sb gap-sm">
				<div className="flex col a-st">
					<label>Newsletter Opt-in erforderlich</label>
					<p>
						Nur Benutzer, die dem Newsletter zugestimmt haben,
						werden in diese Liste aufgenommen.
					</p>
				</div>
				<StatelessToggle
					value={newsletterOptinValue}
					onChange={handleNewsletterOptinChange}
					disabled={loading}
				/>
			</div>
		</div>
	);
};

export default ListDynamicFilter;
