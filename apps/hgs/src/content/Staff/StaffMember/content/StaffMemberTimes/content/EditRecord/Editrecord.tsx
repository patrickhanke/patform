import { Divider, IconButton, InfoBox, Select, SlideInModal } from '@/content/_UI';
import React, { useCallback, useMemo, useState } from 'react';
import { EditRecordProps } from './types';
import FormikRender from '@/content/_UI/FormikRender';
import { Holiday, RecordTimeSettings } from '@/types';
import { createInitialTimes, generateGraphQLQuery, getHolidayDates, months, useDataHandler } from '@/provider';
import { useQuery } from '@apollo/client';
import { formatISO9075 } from 'date-fns';

const Editrecord: React.FC<EditRecordProps> = ({record, refetch, projectId}) => {
	const [editRecord, setEditRecord] = useState<boolean>(false);
	const [timeSettings, setTimeSettings] = useState<RecordTimeSettings>(record.time_settings);
	const [startDate, setStartDate] = useState<string>(record.start_date);
	const {updateData} = useDataHandler();
	const { data: holidayData } = useQuery(
		generateGraphQLQuery({type: 'find', objectName: 'Holiday', fields: ['objectId', 'name', 'type', 'dates']}),
		{variables:{params: {type: {_eq: 'holiday'}, project: {_eq: projectId}}}}
	);
	const [loading, setLoading] = useState(false);

	const editRecordHandler = useCallback(async () => {
		setLoading(true);
		const holidays = holidayData?.objects.findHoliday.results;

		const holidayArray: string[] = [];
		
		holidays.forEach((holiday: Holiday) => {
			if (record?.holiday_template?.holidays?.includes(holiday.objectId)) {
				holidayArray.push(holiday.name);
			}
		});
		
		const holidayDates = getHolidayDates(record.year, holidays);
		// Edit record
		const {default_times} = createInitialTimes({
			start_date: startDate,
			end_date: record?.end_date,
			timeSettings: timeSettings,
			holidays: holidayDates || []
		});

		const updatedTimes = record.default_times.map((time) => {
			const matchingTime = default_times.find((defaultTime) => defaultTime.date === time.date);
			return matchingTime ? matchingTime : time;
		});

		await updateData({
			className: 'Record',
			objectId: record.objectId,
			updateObject: {
				default_times: updatedTimes,
				time_settings: timeSettings
			}
		});
		await refetch();
		setLoading(false);
		setEditRecord(false);
	}, [holidayData, record, startDate, timeSettings]);

	const dateOptions = useMemo(() => {
		const optionsArray = [];
		for (let i = 0; i < 12; i+=1) {
			const date = formatISO9075(new Date(record.year, i, 1),{representation: 'date'});
			optionsArray.push({
				value: date, 
				label: `1. ${months[i].label}`
			});
		}

		return optionsArray;
	}, [record] );


	const renderFields = useMemo(() => [
		{
			label: `Urlaubstage pro Jahr (${record.time_settings.vacation})`,
			name: 'vacation',
			type: 'number',
			value: timeSettings?.vacation || 27,
			dataType: 'number',
			placeholder: '27',
			width: '48px',
			text_align: 'right',
			options: {
				number_start_value: 0
			}
		},
		{
			label: `Wochenstunden (${record.time_settings.hours})`,
			name: 'hours',
			type: 'number',
			value: timeSettings?.hours || 40,
			dataType: 'number',
			placeholder: '40',
			width: '48px',
			text_align: 'right',
			options: {
				number_start_value: 0
			}
		},
		{
			label: `Wochentage (${record.time_settings.weekdays})`,
			name: 'weekdays',
			type: 'number',
			value: timeSettings?.weekdays || 5,
			dataType: 'number',
			placeholder: '5',
			width: '48px',
			text_align: 'right',
			options: {
				number_start_value: 0,
				number_end_value: 7
			}
		},
		{
			label: `Pausenzeit (${record.time_settings.pause})`,
			name: 'pause',
			type: 'number',
			value: timeSettings?.pause || 30,
			dataType: 'number',
			placeholder: '30',
			width: '48px',
			text_align: 'right',
			options: {
				number_start_value: 0
			}
		},
		{
			label: `Standard-Startzeit (${record.time_settings.start})`,
			name: 'start',
			type: 'time',
			value: timeSettings?.start,
			dataType: 'string',
			placeholder: '07:00',
			width: '48px',
			text_align: 'right'
		}
	], [timeSettings]);

	return (
		<div>
			<IconButton 
				onClick={() => setEditRecord(true)}
				icon='edit'
				disabled={record.year < new Date().getFullYear()}
			/>
			<SlideInModal
				isOpen={editRecord}
				cancel={() => setEditRecord(false)}
				confirm={() => editRecordHandler()}
				confirmText='Zeiterfassung speichern'
				header={`Zeiterfassung ${record.year} bearbeiten`}
				disabled={[loading, loading]}
			>
				<div>
					<div className='vertical_container'>
						{record.year >= new Date().getFullYear() && ( 
							<InfoBox color='red' text=' Die Änderungen an der Zeiterfassung werden sofort übernommen und beeinflussen die Saldo Berechnung des laufenden Jahres.' />
						)}

						<h3>
                            Start des neuen Eintrags
						</h3>
						<p>
                            Wenn eine neue Zeiterfassung für das laufende Jahr erstellt werden soll, dann beginnen die neuen Einstellungen zum angebebenen Datum.
						</p>
						<Select
							options={dateOptions}
							value={dateOptions.find(option => option.value === record.start_date)}
							onChange={value => {
								setStartDate(value?.value || '');
							}}
						/>
					</div>
					<Divider />
					<FormikRender
						fields={renderFields}
						labelBefore
						highlightChanges
						valueReturnFunction={(values) => {
							if (values) {
								setTimeSettings(values as RecordTimeSettings);
							}
						}}
					/>
				</div>
            
			</SlideInModal>
		</div>
	);
};

export default Editrecord;