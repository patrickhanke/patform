'use client';

import React, { useState } from 'react';
import DateSelect from './content/DateSelect';
import { useDataHandler } from '@/provider';
import TimeDisplay from './content/TimeDisplay';
import { useQuery } from '@apollo/client';
import { GET_SERVICE_TIME } from '@/queries';
import { date_select_options } from './constants/date_select_options';
import { DateObject } from '@/types';
import { SlideIn, SlideInRight } from '@repo/ui';

const DateSelectInterface = ({objectId}: {objectId: string}) => {
	const {updateData} = useDataHandler();
	const [isOpen, setIsOpen] = useState(false);
	
	const [date, setDate] = useState({
		week_array: [],
		interval: date_select_options[0],
		start_week: NaN,
		end_week: NaN,
		weekday: undefined,
		time: undefined
	} as any);

	const {refetch} = useQuery(GET_SERVICE_TIME, {variables: {id: objectId}, onCompleted(data) {
		setDate(data.objects.getService.time);
	}});

	const dataHandler = (timeValue: DateObject) => {
		console.log(timeValue);
		
		updateData({
			className: 'Service',
			objectId,
			updateObject: {
				time: timeValue,
				dates: timeValue.dates
			}
		});
		refetch();
	};

	const dateHandler = (value: DateObject) =>  {
		setDate(value);
		dataHandler(value);
	};

	return (
		<>
			<div>
				<TimeDisplay date={date} />
			</div>
			<SlideInRight
				size='medium'
				header='Zeit bearbeiten'
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				preventClickOutside
			>
				<DateSelect initialValue={date} dataHandler={dateHandler} setShowSlideIn={setIsOpen}/>
			</SlideInRight>
		</>
	);
};

export default DateSelectInterface;