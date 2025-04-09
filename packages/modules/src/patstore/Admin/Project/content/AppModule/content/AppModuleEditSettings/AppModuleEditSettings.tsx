import React, { useCallback, useState, useMemo } from "react";
import { SlideIn } from "@repo/ui";
import { useImmer } from "use-immer";
import { ModuleSettings } from "@repo/types";
import { useDataHandler } from "@repo/provider";
import AppModuleEditSetting from "./content/AppModuleEditSetting";
import { AppModuleEditSettingsProps } from "./types";
import AppModuleSettings from "./content/AppModuleSettings";

const AppModuleEditSettings = ({
	moduleId,
	initialSettings,
	refetch
}: AppModuleEditSettingsProps) => {
	const { updateData } = useDataHandler();
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

	const editSettingsComponent = useMemo(
		() => (
			<AppModuleEditSetting
				settingKey={activeSetting}
				setSettings={setSettings}
				settings={settings}
			/>
		),
		[activeSetting, settings, setSettings]
	);

	return (
		<>
			<button
				className="full_button sm green"
				onClick={() => setEditSettings(true)}
			>
				Einstellungen
			</button>
			<SlideIn
				cancel={() => setEditSettings(false)}
				confirm={() => {
					setActiveSetting(null);
					slideInConfirmHandler();
				}}
				isOpen={editSettings}
				header="Einstelltungen"
				showSecondaryContent={!!activeSetting}
				secondaryContent={editSettingsComponent}
				disabled={[loading, loading]}
			>
				<div>
					<AppModuleSettings
						settings={settings}
						setActiveSetting={setActiveSetting}
					/>
				</div>
			</SlideIn>
		</>
	);
};

export default AppModuleEditSettings;
