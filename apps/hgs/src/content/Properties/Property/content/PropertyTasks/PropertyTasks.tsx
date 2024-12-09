import { Tasks } from '@/_UI';
import React from 'react';

const PropertyTasks = ({objectId}: {objectId: string}) => {
	return (
		<Tasks id={objectId} className={'Property'} />
	);
};

export default PropertyTasks;