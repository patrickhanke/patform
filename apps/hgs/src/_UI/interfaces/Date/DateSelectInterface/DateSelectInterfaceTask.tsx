'use client';

import React, { useEffect, useState } from 'react';
import DateSelect from './content/DateSelect';
import { useDataHandler } from '@/provider';
import { useQuery } from '@apollo/client';
import { GET_TASK_TIME } from '@/queries';
import SlideIn from '@/_UI/surfaces/SlideIn';
import modi_options from './content/DateSelect/constants/modi_options';
import date_category_options from './content/DateSelect/constants/date_category_options';
import { DateSelectInterfaceTaskProps } from './types';
import { formatISO9075 } from 'date-fns';
import { DateObjectWithNextDates, Task } from '@/types';

const DateSelectInterfaceTask = ({taskId, showDateInterface, setShowDateInterface, tasksRefetch}: DateSelectInterfaceTaskProps) => {
	const {updateData} = useDataHandler();
	const [loading, setLoading] = useState(false);

	const [time, setTime] = useState<Task['time']>({
		type: modi_options[0],
		category: date_category_options[0],
		interval: 1,
		start_date: '',
		end_date: '',
		dates: [''],
		weekday: '',
		time: ''
	});

	const {loading: queryLoading, refetch} = useQuery(GET_TASK_TIME, {
		variables: {id: taskId}, 
		onCompleted(data) {
			setTime(data.objects.getTask.time);
		},
		notifyOnNetworkStatusChange: true
	});

	useEffect(() => {
		refetch();
	}, [showDateInterface]);

	const dataHandler = async (timeValue: DateObjectWithNextDates ) => {
		const timeValueCopy = {...timeValue};
		
		const next_dates: string[] = [];

		timeValueCopy.dates.forEach((date: string )=> {
			const isodate = formatISO9075(new Date(date), {representation: 'date'});
			if (!next_dates.includes(isodate) && new Date(date).getTime() > new Date().getTime()) {
				next_dates.push(isodate);
			}
		});
		
		setLoading(true);
		await updateData({
			className: 'Task',
			objectId: taskId,
			updateObject: {
				type: timeValue.type.value,
				category: timeValue.category.value,
				dates: next_dates,
				time: timeValue
			}
		});
		if (tasksRefetch) {
			tasksRefetch();
		}
		setLoading(false);
		setShowDateInterface(false);
	};

	return (
		<SlideIn
			isOpen={showDateInterface}
			setIsOpen={setShowDateInterface}
			header='Zeiten bearbeiten'
			size='small'
			preventClickOutside
		>
			<DateSelect
				initialValue={time}
				dataHandler={dataHandler}
				setShowSlideIn={setShowDateInterface}
				loading={loading || queryLoading}
			/>
		</SlideIn>
	);
};

export default DateSelectInterfaceTask;