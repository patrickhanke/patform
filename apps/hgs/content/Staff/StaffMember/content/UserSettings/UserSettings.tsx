import { getIsoFromDate } from '@provider';
import { GET_USER_SETTINGS } from '@queries';
import { fieldsType } from '@types';
import { useQuery } from '@apollo/client';
import { Form, Loader } from '@repo/ui';
import React, { useMemo } from 'react';

const UserSettings = ({userId}: {userId: string}) => {
	const {data, refetch} = useQuery(GET_USER_SETTINGS, {variables: {id: userId}});

	const renderFields = useMemo(() => {
		let selectFields = [] as fieldsType;
		if (data) {
			const settings =  data.objects.get_User.settings;
			selectFields = [
				{
					label: 'Mitarbeiter seit',
					name: 'start_date',
					type: 'date',
					value: settings?.start_date || getIsoFromDate(new Date()),
					dataType: 'date'
				},
				{
					label: 'Urlaubstage pro Jahr',
					name: 'vacation_days',
					type: 'number',
					value: settings?.vacation_days || 27,
					dataType: 'number',
					placeholder: '27'
				},
				{
					label: 'Farbe',
					name: 'color',
					type: 'color',
					value: settings?.color || '#d2383e',
					dataType: 'string',
					placeholder: '#d2383e'
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
				apiClass='_User'
				id={userId}
				entry='settings'
				afterSaveFunction={ () => refetch()}
				labelBefore
			/>
		</div>
	);
};

export default UserSettings;