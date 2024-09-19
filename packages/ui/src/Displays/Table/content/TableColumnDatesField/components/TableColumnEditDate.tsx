import { useCallback } from 'react';
import { Map, StatelessToggle, SwitchButtons } from '@repo/ui';
import { EventDate } from '@repo/types';
import { TableColumnEditDateProps } from '../types';
import locationButtonStates from '../constants/locationButtonStates';
import { set, cloneDeep } from 'lodash';

const TableColumnEditDate = ({date, setDates}: TableColumnEditDateProps) => {
	const changeHandler = useCallback(( key: string, value: EventDate[keyof EventDate] | EventDate['location'][keyof EventDate['location']]) => {
		if (date ) {
			setDates((draft: EventDate[]) => {
				const index: number = draft.findIndex(dateToFind => dateToFind.id === date.id);
				const dateCopy: typeof date = cloneDeep(date);
				set(dateCopy, key, value);

				if (index !== -1) {
					draft[index] = {...dateCopy};
				}
			});
		}
	}, [date, setDates]);

	if (!date) {
		return null;
	} 
    
	return (
		<div>
			<h3>{date.label}</h3>
			<div>
				<label>Label</label>
				<input type='text' defaultValue={date.label} onChange={(e) => changeHandler('label', e.target.value)} />
			</div>
			<div>
				<label>Startzeit</label>
				<input type='datetime-local' defaultValue={date.start} onChange={(e) => changeHandler('start', e.target.value)} />
			</div>
			<div>
				<label>Endzeit</label>
				<input type='datetime-local' defaultValue={date.end} onChange={(e) => changeHandler('end', e.target.value)} />
			</div>
			<div>
				<label>Ganztägig?</label>
				<StatelessToggle value={date.full_day} onChange={(value) => changeHandler('full_day', value)} />
			</div>
			<div>
				<label>Ort</label>
				<SwitchButtons
					buttonStates={locationButtonStates}
					currentStates={locationButtonStates.find(button => button.value === date.location.type) as {label: string, value: string}}
					changeHandler={(value) => changeHandler('location.type', value.value)}
				/>
				<div className='table_columns_dates_location_container'>
					{date.location.type === 'address' &&
						<input type='text' defaultValue={date.location.address} onChange={(e) => changeHandler('location.address', e.target.value)} />
					}
					{date.location.type === 'online' &&
						<input type='text' defaultValue={date.location.online} onChange={(e) => changeHandler('location.online', e.target.value)} />
					}
					{date.location.type === 'map' &&
						<Map initialPlace={date.location.map} onChange={(place) => changeHandler('location.map', place)} />
					}
				</div>
			</div>
           
		</div>
	);
};

export default TableColumnEditDate;