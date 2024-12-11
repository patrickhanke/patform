import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { fieldsType } from '@types';
import { GET_PROPERTY_SETTINGS } from '@queries';
import { Form, Loader } from '@repo/ui';

const PropertySettings = ({objectId}: {objectId: string}) => {
	const {data, refetch} = useQuery(GET_PROPERTY_SETTINGS, {variables: {id: objectId}});
	
	const renderFields = useMemo(() => {
		let selectFields = [] as fieldsType;
		if (data) {
			const settings =  data.objects.getProperty.settings;
			selectFields = [
				{
					label: 'Schlüsselnummer',
					name: 'key_number',
					type: 'number',
					value: settings.key_number || '',
					dataType: 'number'
				}
				
			] as fieldsType;
		}
		return selectFields;
	}, [data]);

	if (renderFields.length === 0) return <Loader width={'100%'} height='30px' />;
	
	return (
		<div className='site_content'>
			<Form
				fields={renderFields}
				apiClass='Property'
				id={objectId}
				entry='settings'
				afterSaveFunction={ () => refetch()}
				labelBefore
			/>
		</div>
	);
};

export default PropertySettings;