import React, { useCallback, useState } from "react";
import { SlideIn } from "@repo/ui";
import { useImmer } from "use-immer";
import { ModuleSettings } from "@repo/types";
import { useDataHandler } from "@repo/provider";
import { AppModuleEditSettingsProps } from "./types";
import { AppModuleEditCategories } from "./content";

const AppModuleEditSettings = ({
	moduleId,
	initialSettings,
	refetch,
	modulePath
}: AppModuleEditSettingsProps) => {
	const { updateData } = useDataHandler(true, false);
	const [editSettings, setEditSettings] = React.useState(false);
	const [loading, setLoading] = useState(false);
	const [settings, setSettings] = useImmer<ModuleSettings>(
		initialSettings || {}
	);
	const [activeSetting, setActiveSetting] = React.useState(
		null as unknown as keyof ModuleSettings | null
	);

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);

		const newSettings: ModuleSettings = { ...settings };

		await updateData({
			className: "Module",
			objectId: moduleId,
			updateObject: {
				settings: newSettings
			}
		});

		setEditSettings(false);
		refetch();
		setLoading(false);
	}, [settings, activeSetting]);

	return (
		<>
			<button
				className="full_button sm secondary"
				onClick={() => setEditSettings(true)}
				disabled={loading || modulePath !== "/categories"}
			>
				Einträge bearbeiten
			</button>
			<SlideIn
				cancel={() => setEditSettings(false)}
				confirm={() => {
					setActiveSetting(null);
					slideInConfirmHandler();
				}}
				isOpen={editSettings}
				header="Einstellungen"
				showSecondaryContent={!!activeSetting}
				disabled={[loading, loading]}
			>
				<AppModuleEditCategories
					settingKey={"categories"}
					setSettings={setSettings}
					settings={settings}
				/>
			</SlideIn>
		</>
	);
};

export default AppModuleEditSettings;
