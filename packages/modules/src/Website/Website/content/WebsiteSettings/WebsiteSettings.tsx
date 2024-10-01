import { Field, Form } from '@repo/ui';
import { WebsiteSettingsProps } from './types';
import { useMemo } from 'react';

const WebsiteSettings = ({settings}: WebsiteSettingsProps ) => {
	console.log(settings);
    
	const siteSettings = settings?.site_settings;
	const fields: Field[] = useMemo(() => [
		{
			label: 'Primärfarbe',
			name: 'primary_color',
			id: 'primary_color',
			type: 'color',
			value: siteSettings?.primary_color
		},
		{
			label: 'Sekundärfarbe',
			name: 'secondary_color',
			id: 'secondary_color',
			type: 'color',
			value: siteSettings?.secondary_color
		},
		{
			label: 'Tertiärfrage',
			name: 'tertiary_color',
			id: 'tertiary_color',
			type: 'color',
			value: siteSettings?.secondary_color
		},
		{
			label: 'Logo',
			name: 'logo',
			id: 'logo',
			type: 'image',
			value: siteSettings?.logo
		},
		{
			label: 'Favicon',
			name: 'logo_square',
			id: 'logo_square',
			type: 'image',
			value: siteSettings?.logo_square
		}

	], [siteSettings]);


	const updateSettings = (data: any) => console.log(data);

	return (
		<div>
			<Form
				data={siteSettings}
				fields={fields}
				formSubmitHandler={updateSettings}
				isHorizontal={true}
			/>
		</div>
	);
};

export default WebsiteSettings;