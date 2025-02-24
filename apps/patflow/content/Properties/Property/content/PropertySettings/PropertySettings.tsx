import React, { FC, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { fieldsType } from '@types';
import { GET_PROPERTY_SETTINGS } from '@queries';
import { Form, Loader } from '@repo/ui';
import { generateGraphQLQuery, useDataHandler } from '@repo/provider';
import { PropertySettingsProps } from './types';
import ArchiveProperty from './components/ArchiveProperty';

const PropertySettings : FC<PropertySettingsProps> = ({propertyId, refetch}) => {
	const {updateData} = useDataHandler();
	const {data, refetch: settingsRefetch} = useQuery(generateGraphQLQuery({
		objectName: 'Property',
		type: 'get',
		fields: ['objectId', ' name', 'settings', 'archived']
	}), {variables: {id: propertyId}});

	
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
				},
				{
					label: 'Informationen',
					name: 'info',
					type: 'textarea',
					value: settings.info || '',
					dataType: 'string'
				}
				
			] as fieldsType;
		}
		return selectFields;
	}, [data]);

	
	
	
	if (renderFields.length === 0) return <Loader width={'100%'} height='30px' />;
	
	const property = data?.objects.getProperty;

	return (
		<div className='flex col a-st gap-md'>
			<Form
				fields={renderFields}
				formSubmitHandler={async (data) => {
					await updateData({
						className: 'Property',
						objectId: propertyId,
						updateObject: {
							settings: data
						},
					})
					settingsRefetch();
				}}
				isHorizontal
				useWithDebounce
			/>
			
			<ArchiveProperty propertyId={propertyId} refetch={refetch} isArchived={property.archived} />
		</div>
	);
};

export default PropertySettings;