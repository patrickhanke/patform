import { IconButton } from '@repo/ui';
import '../styles.scss';
import { useMemo } from 'react';
import { formatISO9075 } from 'date-fns';
import { TableColumnTimeProps } from '../types';
import { weekdays } from '@repo/provider';

const TableColumnTime = ({time, setActiveTime}: TableColumnTimeProps) => {
	const title = useMemo(() => {
		if (time.weekday) {
			const day = weekdays.find(day => day.value === time.weekday);
			return day?.label || 'Kein Wochentag';
		} else if (time.start) {
			return formatISO9075(new Date(time.start));
		} else {
			return 'Kein Datum';
		}		
		
	}, [time]);	
	
	return (
		<div className='table_column_time_container content_element'>
			<div>
				<h3>
					{title}
				</h3>
			</div>
			<div className='button_container'>
				<IconButton
					icon='edit'
					onClick={() => setActiveTime(time.id)}
				/>
				<IconButton
					icon='delete'
					onClick={() => null}
				/>
			</div>
		</div>
	);
};

export default TableColumnTime;