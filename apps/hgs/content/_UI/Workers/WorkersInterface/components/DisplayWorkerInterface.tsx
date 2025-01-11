import React, { useContext, useMemo } from 'react';
import styles from '../WorkersInterface.module.scss';
import { DisplayWorkerInterfaceComponent } from '../types';
import { useQuery } from '@apollo/client';
import { find_day, find_record } from '@queries';
import { absence_state_options, AppContext, getDatesFromAbsences, getImageUrl } from '@provider';
import { getDayOfYear } from 'date-fns';
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
			const dateObject = dates.find(date => date.date === nextDate);
			if (dateObject) {
				isAbsent = true;
				type = dateObject.type as Absence['type'];
			}
		}
		return({isAbsent, type});
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
			{workerAbsence.isAbsent && 
				<div className={styles.display_worker_absence} >
					<StateDisplay 
						type='state' 
						stateOptions={absence_state_options}
						state={workerAbsence.type}
					/> 
				</div>
			}
		</button>
	);
};

export default DisplayWorkerInterface;