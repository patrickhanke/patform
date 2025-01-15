import React, { useContext, useMemo } from 'react';
import styles from '../WorkersInterface.module.scss';
import { DisplayWorkerInterfaceComponent } from '../types';
import { useQuery } from '@apollo/client';
import { find_day } from '@queries';
import { absence_type_options, AppContext, getImageUrl } from '@provider';
import { formatISO9075 } from 'date-fns';
import { Absence, Day } from '@types';
import { StateDisplay } from '@repo/ui';

const DisplayWorkerInterface = ({worker, isSelected, onChange, nextDate, showAvailability=true} :DisplayWorkerInterfaceComponent ) => {
	const {year} = useContext(AppContext);
	const {data} = useQuery(find_day, {
		variables: {params: {year: {_eq: year}, type: {_eq: 'absence'}, user: {_eq: worker.objectId}}},
		skip: !showAvailability
	});

	console.log(nextDate);
	
	
	const workerAbsence = useMemo(() => {
		let isAbsent = false;
		let type: Absence['type'] = 'other';
		if (data && nextDate) {
			const dates: Day[] = data.objects.findDay.results;
			console.log(dates)
			const formattedNextDay = formatISO9075( new Date(nextDate), {representation: 'date'});
			const dateObject = dates.find(date => date.date === formattedNextDay);
			console.log(dateObject);
			
			
			if (dateObject) {
				isAbsent = true;
				type = dateObject?.absence?.type as Absence['type'];
			}
		}
		return({
			isAbsent, 
			type,
			color: absence_type_options.find(option => option.value === type)?.color,
			label: absence_type_options.find(option => option.value === type)?.label
		});
	}, [data, showAvailability]);

	console.log(workerAbsence)
	console.log(data)

	return (
		<button
			className={styles.display_worker_container}
			data-isselected={isSelected}
			disabled={workerAbsence.isAbsent}
			data-isabsent={workerAbsence.isAbsent}
			onClick={() =>onChange(isSelected ? 'remove' : 'add', worker.objectId)} 
		>
			<div className={styles.display_worker_container_pers_data}>
				<div className={styles.display_worker_image_container} >
					{worker.portrait ? 
						<img
							src={getImageUrl(worker.portrait, 60,60)}
							alt={`${worker.first_name} ${worker.family_name}`}
							width={'24px'}
							height={'24px'}
						/> : null   
					}
				</div>
				<h4>
					{`${worker.first_name} ${worker.family_name}`}
				</h4>
			</div>
			{workerAbsence.isAbsent && workerAbsence.type && workerAbsence.color && workerAbsence.label && 
				<div className={styles.display_worker_absence} >
					<StateDisplay 
						label={workerAbsence.label}
						color={workerAbsence.color} 
					/> 
				</div>
			}
		</button>
	);
};

export default DisplayWorkerInterface;