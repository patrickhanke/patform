"use client";

import {
	InfoBox,
	Page,
	StatelessToggle,
	TextInput,
	usePageData
} from "@repo/ui";
import { SavingsGroupModuleData } from "@repo/types";
import { useSavingsGroup } from "../hooks/SavingsGroupContext";
import { savingsGroupUpdateOptions } from "../functions/updateOptions";
import { centsToInput, parseEuroToCents } from "../functions/format";

const Sparregeln = () => {
	const { module, moduleData, refetch } = useSavingsGroup();
	const { data, setData } = usePageData<SavingsGroupModuleData>(
		{ initialData: moduleData, objectId: module.objectId },
		savingsGroupUpdateOptions(module)
	);

	const rule = data?.savingRules[0];
	if (!data || !rule) return null;

	const setCents = (key: string, text: string) => {
		setData(`savingRules.0.${key}`, parseEuroToCents(text));
	};

	return (
		<Page
			title="Sparregeln"
			description="Diese Regeln werden bei jeder Sparkastenleerung automatisch angewendet."
			emptyContent
			refetch={refetch}
		>
			<div className="flex col a-st gap-sm" style={{ maxWidth: 520 }}>
				<InfoBox
					status="info"
					maxWidth="100%"
					text="Sparclub-, Lotto- und Strafgeldbeiträge werden je Sparfach aus dem Einwurf berechnet."
				/>
				<TextInput
					id="rule-name"
					label="Bezeichnung"
					defaultValue={rule.name}
					onChange={(value) => setData("savingRules.0.name", value)}
				/>
				<h3>Mindesteinwurf & Strafgeld</h3>
				<TextInput
					id="rule-einwurf-min"
					label="Mindesteinwurf"
					defaultValue={centsToInput(rule.einwurf_min)}
					onChange={(value) => setCents("einwurf_min", value)}
				/>
				<TextInput
					id="rule-strafgeld"
					label="Strafgeld"
					defaultValue={centsToInput(rule.strafgeld)}
					onChange={(value) => setCents("strafgeld", value)}
				/>
				<h3>Sparclubbeitrag</h3>
				<TextInput
					id="rule-sparclub"
					label="Sparclubbeitrag je Leerung"
					defaultValue={centsToInput(rule.sparclub)}
					onChange={(value) => setCents("sparclub", value)}
				/>
				<TextInput
					id="rule-sparclub-min"
					label="Beitrag wird fällig ab Einwurf von"
					defaultValue={centsToInput(rule.sparclub_min)}
					onChange={(value) => setCents("sparclub_min", value)}
				/>
				<StatelessToggle
					label="Auch bei vorgesparten Fächern fällig"
					value={rule.sparclub_vg === 1}
					onChange={(value) =>
						setData("savingRules.0.sparclub_vg", value ? 1 : 0)
					}
				/>
				<h3>Lottobeitrag</h3>
				<TextInput
					id="rule-lotto"
					label="Lottobeitrag je Leerung"
					defaultValue={centsToInput(rule.lotto)}
					onChange={(value) => setCents("lotto", value)}
				/>
				<TextInput
					id="rule-lotto-min"
					label="Beitrag wird fällig ab Einwurf von"
					defaultValue={centsToInput(rule.lotto_min)}
					onChange={(value) => setCents("lotto_min", value)}
				/>
				<StatelessToggle
					label="Auch bei vorgesparten Fächern fällig"
					value={rule.lotto_vg === 1}
					onChange={(value) =>
						setData("savingRules.0.lotto_vg", value ? 1 : 0)
					}
				/>
			</div>
		</Page>
	);
};

export default Sparregeln;
