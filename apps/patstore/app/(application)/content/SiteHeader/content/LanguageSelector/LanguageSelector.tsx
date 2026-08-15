import { languages_short, PatstoreAppContext } from '@repo/provider';
import { SwitchButtons } from '@repo/ui';
import React, { useContext, useMemo } from 'react'
import { Language, LanguageValue } from '@repo/types';

type LanguageSelect = {
	value: LanguageValue;
	label: Language["label"];
	disabled: boolean;
}

const LanguageSelector = () => {
	const { language, setLanguage, project } = useContext(PatstoreAppContext);

	const handleLanguageChange = (language: typeof languages_short[number]) => {
		console.log(language);
		setLanguage(language.value);
	}
	const languagesSelect  = useMemo(() => {
		const languages: LanguageValue[] = project?.settings?.languages || ["de"];
		const languagesArray: LanguageSelect[] = [];
		languages.forEach((lng) => {
			const findLng = languages_short.find((lang) => lang.value === lng);
			if (findLng) {
				languagesArray.push({ label: findLng.label, value: findLng.value, disabled: languages.length === 1 });
			}
		});
		return languagesArray;
	}, [language]);

	console.log(languagesSelect);
	if (languagesSelect && languagesSelect.length === 1) {
		return <div className="label">{languagesSelect[0].label}</div>;
	}

	if (process.env.NODE_ENV !== "development") {
		return null;
	}
	return (	
		<div>
			<SwitchButtons
				buttonStates={languagesSelect}
				currentStates={languagesSelect.find((lng) => lng.value === language)}
				changeHandler={handleLanguageChange}
			/>
		</div>
  )
}

export default LanguageSelector