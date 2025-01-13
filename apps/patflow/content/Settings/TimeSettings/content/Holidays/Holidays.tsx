import React from 'react';
import { HolidaysProps } from './types';
import useHolidayColumns from './hooks/useHolidayColumns';
import { Table } from '@repo/ui';

const Holidays: React.FC<HolidaysProps> = ({holidays}) => {
	const columns = useHolidayColumns();

	return (
		<div className='site_content'>
			<div className='content_element no_padding'>
				<Table
					data={holidays || []}
					columns={columns}
				/>
			</div>
		</div>
	);
};

export default Holidays;