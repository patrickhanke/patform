"use client";

import { Page, Select, TextInput, usePageData } from "@repo/ui";
import { SavingsGroupModuleData } from "@repo/types";
import { useSavingsGroup } from "../hooks/SavingsGroupContext";
import { savingsGroupUpdateOptions } from "../functions/updateOptions";
import { COUNTRY_OPTIONS, CURRENCY_OPTIONS } from "../constants/defaults";

const Verein = () => {
	const { module, moduleData, refetch } = useSavingsGroup();
	const { data, setData } = usePageData<SavingsGroupModuleData>(
		{ initialData: moduleData, objectId: module.objectId },
		savingsGroupUpdateOptions(module)
	);

	if (!data) return null;

	const settings = data.settings;

	return (
		<Page title="Verein" emptyContent refetch={refetch}>
			<div className="flex col a-st gap-sm" style={{ maxWidth: 520 }}>
				<TextInput
					id="club-name"
					label="Sparclubname"
					defaultValue={settings.name}
					onChange={(value) => setData("settings.name", value)}
				/>
				<TextInput
					id="club-street"
					label="Strasse"
					defaultValue={settings.street}
					onChange={(value) => setData("settings.street", value)}
				/>
				<TextInput
					id="club-hn"
					label="Hausnummer"
					defaultValue={settings.houseNumber}
					onChange={(value) => setData("settings.houseNumber", value)}
				/>
				<TextInput
					id="club-zip"
					label="PLZ"
					defaultValue={settings.zip}
					onChange={(value) => setData("settings.zip", value)}
				/>
				<TextInput
					id="club-city"
					label="Ort"
					defaultValue={settings.city}
					onChange={(value) => setData("settings.city", value)}
				/>
				<TextInput
					id="club-email"
					label="E-Mail"
					type="email"
					defaultValue={settings.email}
					onChange={(value) => setData("settings.email", value)}
				/>
				<Select
					id="club-country"
					label="Land"
					value={settings.country}
					width={240}
					options={COUNTRY_OPTIONS.map((value) => ({
						value,
						label: value
					}))}
					onChange={(option: { value?: string } | null) =>
						setData("settings.country", option?.value || "DE")
					}
				/>
				<Select
					id="club-currency"
					label="Währung"
					value={settings.currency}
					width={240}
					options={CURRENCY_OPTIONS.map((value) => ({
						value,
						label: value
					}))}
					onChange={(option: { value?: string } | null) =>
						setData("settings.currency", option?.value || "EUR")
					}
				/>
			</div>
		</Page>
	);
};

export default Verein;
