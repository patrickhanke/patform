import { FIND_ALL_STAFF } from '@/queries';
import { useQuery } from '@apollo/client';
import React from 'react';
import styles from './WorkersInterface.module.scss';
import DisplayWorkerInterface from './components/DisplayWorkerInterface';
import { WorkersInterfaceComponent } from './types';
import { Worker } from '@/types';
import { SlideIn } from '@/_UI/surfaces';

const WorkersInterface = ({workers, onChange, nextDate}: WorkersInterfaceComponent) => {
	const {data} = useQuery(FIND_ALL_STAFF);
	const [isOpen, setIsOpen] = React.useState(false);
    
	return (
		<div className={styles.worker_interface_container}>
			<SlideIn isOpen={isOpen} setIsOpen={setIsOpen} header='Arbeiter auswählen'>
				{data && data.objects.find_User.results.map((worker: Worker) => (
					<DisplayWorkerInterface 
						key={worker.objectId} 
						worker={worker}  
						isSelected={workers.includes(worker.objectId)}
						onChange={onChange}
						nextDate={nextDate}
					/>
				))}
			</SlideIn>
		</div>
	);
};

export default WorkersInterface;