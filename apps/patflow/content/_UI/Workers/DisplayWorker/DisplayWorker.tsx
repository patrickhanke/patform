import React, { useContext, useMemo } from 'react';
import styles from './DisplayWorker.module.scss';
import { GrClose } from 'react-icons/gr';
import { useQuery } from '@apollo/client';
import { find_day, GET_USER_DISPLAY_DATA } from '@queries';
import { absence_type_options, AppContext, getImageUrl } from '@provider';
import { formatISO9075 } from 'date-fns';
import { DisplayWorkersProps } from './types';
import { shadeColor } from '@repo/provider';
import { Loader, StateDisplay } from '@repo/ui';
import { Absence, Day } from '@types';

const DisplayWorker = ({workerId, showState= false, nextDate, showAvailability = false, onlyImage=false}: DisplayWorkersProps) => {
	const {year} = useContext(AppContext);

	const {data: workerData, loading: wokerLoading} = useQuery(GET_USER_DISPLAY_DATA, {
		variables: {id: workerId}
	});

	console.log(nextDate);
	
	
	const {data, loading: dayLoading} = useQuery(find_day, {
		variables: {params: {year: {_eq: year}, type: {_eq: 'absence'}, user: {_eq: workerId}}},
		skip: !showAvailability
	});
	console.log(data?.objects.findDay.results);

	const workerAbsence = useMemo(() => {
		let isAbsent = false;
		let type: Absence['type'] = 'other';
		if (data && nextDate) {
			const dates: Day[] = data.objects.findDay.results;
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

	console.log(workerAbsence);
	

	if (wokerLoading || dayLoading) return <Loader width={'24px'} height={'24px'} />;
	
	if (workerData) {
		const worker  = workerData.objects.get_User;
		return (
			<div className={styles.display_worker_container} data-isabsent={workerAbsence.isAbsent} data-onlyimage={onlyImage} >
				{worker.portrait ? 
					<div className={styles.display_worker_image_container} data-isabsent={workerAbsence.isAbsent} data-onlyimage={onlyImage} >
						<img
							src={getImageUrl(worker.portrait, 60,60)}
							alt={`${worker.first_name} ${worker.family_name}`}
							width={onlyImage ? '24px' : '18px'}
							height={onlyImage ? '24px' : '18px'}
						/>
					</div>
					:
					<div className={styles.display_worker_no_image} data-onlyimage={onlyImage}>
						<div className={styles.display_worker_no_image_background} style={{backgroundColor: shadeColor(worker.color, 240)}} />
						<div className={styles.display_worker_no_image_character} style={{color: worker.color}}>{`${worker.first_name.charAt(0)}${worker.family_name.charAt(0)}`}</div>
					</div>
				}
				{!onlyImage && 
					<div>
						{`${worker.first_name} ${worker.family_name}`}
					</div>
				}
				<div>
				{showState && workerAbsence.isAbsent && workerAbsence.type && workerAbsence.color && workerAbsence.label && 
						<div className={styles.display_worker_absence} >
							<StateDisplay 
								label={workerAbsence.label}
								color={workerAbsence.color} 
							/> 
						</div>
					}
				</div>
			</div>
		);
	}

	if (onlyImage) return <Loader width={'24px'} height={'24px'} />;

	return <span>Unbekannt</span>;
};

export default DisplayWorker;