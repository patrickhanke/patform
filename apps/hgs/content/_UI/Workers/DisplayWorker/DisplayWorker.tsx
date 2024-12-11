import React, { useContext, useMemo } from 'react';
import styles from './DisplayWorker.module.scss';
import { GrClose } from 'react-icons/gr';
import { useQuery } from '@apollo/client';
import { find_record, GET_USER_DISPLAY_DATA } from '@/queries';
import { AppContext, getDatesFromAbsences, getImageUrl } from '@/provider';
import { getDayOfYear } from 'date-fns';
import { DisplayWorkersProps } from './types';
import { shadeColor } from '@provider/functions';
import { Loader } from '@repo/ui';

const DisplayWorker = ({workerId, removeWorker, nextDate, showAvailability = false, onlyImage=false}: DisplayWorkersProps) => {
	const {year} = useContext(AppContext);
	const {data} = useQuery(find_record, {
		variables: {params: {user: {'_eq': workerId}, year: {_eq: year}}},
		skip: !showAvailability
	});

	const {data: workerData} = useQuery(GET_USER_DISPLAY_DATA, {
		variables: {id: workerId}
	});
	
	const workerAbsence = useMemo(() => {
		let isAbsent = false;
		if (data && nextDate) {
			const dates = getDatesFromAbsences(data.objects.findRecord.results).abseceDays;
			
			isAbsent = dates.includes(getDayOfYear(new Date(nextDate)));
		}
		return isAbsent;

	}, [data, showAvailability]);
	
	if (workerData) {
		const worker  = workerData.objects.get_User;
		return (
			<div className={styles.display_worker_container} data-isabsent={workerAbsence} data-onlyimage={onlyImage} >
				{worker.portrait ? 
					<div className={styles.display_worker_image_container} data-isabsent={workerAbsence} data-onlyimage={onlyImage} >
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
					{removeWorker && 
					<div className={styles.display_worker_delete_button} onClick={() => removeWorker(worker.objectId)}>
						<GrClose />
					</div>
					}
				</div>
			</div>
		);
	}

	if (onlyImage) return <Loader width={'24px'} height={'24px'} />;

	return <Loader width={'120px'} height={'18px'} />;
};

export default DisplayWorker;