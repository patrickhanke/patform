import { convertMillisecondsToString, getDateString } from '@/provider';
import React, { useMemo } from 'react';
import getRemainingVacation from '../functions/getRemainingVacation';
import getRecordSaldo from '../functions/getRecordSaldo';
import { RecordSettingsProps } from '../types';
import styles from '../CreateRecord.module.scss';
import { Divider, InfoBox } from '@/_UI';

const RecordSettings: React.FC<RecordSettingsProps> = ({record, days}) => {
	const recordInfo = useMemo(() => {
		let initial_vacation  = 0;
		if (record && days) {
			initial_vacation = getRemainingVacation(
				record.start_date, 
				record.end_date, 
				record, 
				days
			);
		} else {
			initial_vacation = 0;
		}

		let initial_saldo = 0;

		if (record && days) {
			initial_saldo = getRecordSaldo(
				record.start_date, 
				record.end_date, 
				record.default_times, 
				days
			);
		} else {
			initial_saldo = 0;
		}

		return ([
			{
				label: 'Start',
				value: getDateString(record.start_date).date
			},
			{
				label: 'Ende',
				value: getDateString(record?.end_date).date
			},
			{
				label: 'Resuturlaub (zum gegenwärtigen Zeitpunkt)',
				value: `${initial_vacation} Tage`
			},
			{
				label: 'Überstunden (zum gegenwärtigen Zeitpunkt)',
				value: `${convertMillisecondsToString(initial_saldo)} Stunden`
			},
			{
				label: 'Feiertage',
				value: record.holiday_template?.name
			},
			{
				label: 'Urlaubstage pro Jahr',
				value: `${record.time_settings.vacation} Tage`
			},
			{
				label: 'Wochenstunden',
				value: `${record.time_settings.hours} Stunden`
			},
			{
				label: 'Pause (in Minuten)',
				value: `${record.time_settings.pause} Minuten`
			}
		]);
	}, [record, days]);
    
	return (
		<div>
			<h3>
				Zeitangaben und Daten des bestehenden Eintrags (Urlaube und Überstunden)
			</h3>
			<Divider showLine={false} />
			<div className={styles.record_settings_container}>
				{recordInfo.map((info) => (
					<div key={info.label} className={styles.record_settings_info}>
						<div className='label'>
							{info.label}
						</div>
						<div>
							<p>{info.value}</p>
						</div>
					</div>
				))}
			</div>
			<InfoBox text='Der Start des Jahres bestimmt den Beginn der Zeiterfassung. Die Zeiterfassung beginnt am 1.1 und endet am 31.12. des gewählten Jahres.' />

		</div>
	);
};

export default RecordSettings;