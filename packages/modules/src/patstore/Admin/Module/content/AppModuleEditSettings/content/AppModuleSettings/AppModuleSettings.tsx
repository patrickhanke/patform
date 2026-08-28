import { ModuleSettings } from "@repo/types";
import { Dispatch, SetStateAction } from "react";
import LanguageSettings from "./components/LanguageSettings";
import { SetPageData } from "@repo/ui";

const AppModuleSettings = ({
	setData,
	settings
}: {
	setData: SetPageData<ModuleSettings>;
	settings: ModuleSettings;
}) => {
	return (
		<>
			<LanguageSettings setData={setData} settings={settings} />
		</>
	);
};

export default AppModuleSettings;
