import { AppModuleSettingsCategoriesProps } from "../types";

const AppModuleSettingsCategories = ({setting, setActiveSetting}: AppModuleSettingsCategoriesProps) => {
    
    return (
        <div>
            <button onClick={() => setActiveSetting(setting)}>
                Kategorien
            </button>
        </div>
    )

};

export default AppModuleSettingsCategories;