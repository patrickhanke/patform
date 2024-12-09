import { Tickets } from '@/content/_UI';
import React from 'react';

const PropertyTickets = ({id}: {id: string}) => {
	return (
		<>
			<Tickets id={id} className='Property' />
		</>
	);
};

export default PropertyTickets;