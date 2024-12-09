import { SlideInModal } from '@/content/_UI';
import React from 'react';

const EditUserTimes = () => {
	const [editTimes, setEditTimes] = React.useState(false);
	return (
		<>
			<button onClick={() => setEditTimes(true)}>
                Zeiten bearbeiten
			</button>
			<SlideInModal
				isOpen={editTimes}
				cancel={() => setEditTimes(false)}
			>


			</SlideInModal>
		</>
	);
};

export default EditUserTimes;