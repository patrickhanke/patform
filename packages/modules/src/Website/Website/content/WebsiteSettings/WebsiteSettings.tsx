import { Field, Form } from '@repo/ui';
import { WebsiteSettingsProps } from './types';
import { useMemo } from 'react';
import { cloneDeep, set } from 'lodash';
import { useDataHandler } from '@repo/provider';
import { FormikValues } from 'formik';

const WebsiteSettings = ({settings, moduleId}: WebsiteSettingsProps ) => {
	const {updateData} = useDataHandler();  
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
			options: {
				return_type: 'string',
				max_file_count: 1
			},
			value: siteSettings?.logo
		},
		{
			label: 'Favicon',
			name: 'logo_square',
			id: 'logo_square',
			type: 'image',
			options: {	
				return_type: 'string',
				max_file_count: 1
			},
			value: siteSettings?.logo_square
		}

	], [siteSettings]);

	const updateSettings = (data: FormikValues) => {
		const settingsCopy = cloneDeep(settings);
		set(settingsCopy, 'site_settings', data);
		
		updateData({
			objectId: moduleId,
			className: 'Module',
			updateObject:{
				settings: settingsCopy
			}
		});
	};

	return (
		<div className='content_element'>
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