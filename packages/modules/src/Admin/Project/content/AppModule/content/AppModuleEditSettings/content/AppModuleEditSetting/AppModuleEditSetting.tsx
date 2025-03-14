import { AppModuleEditSettingProps } from './types';
import AppModuleEditSettingsCategories from './components/AppModuleEditSettingsCategories';

const AppModuleEditSetting = ({settingKey, settings, setSettings}: AppModuleEditSettingProps) => {
    console.log(settingKey);

    if (!settings || !settingKey) {
        return null
    } 

    if (settingKey === 'categories') {
        return <AppModuleEditSettingsCategories categories={settings.categories} setSettings={setSettings} />
    }

    return null;
}

export default AppModuleEditSetting;