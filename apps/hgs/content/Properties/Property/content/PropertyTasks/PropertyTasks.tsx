import { TaskList, Tasks } from '@content';
import React from 'react';

const PropertyTasks = ({objectId}: {objectId: string}) => {

	return (
		<Tasks pageState='active' id={objectId} className={'Property'} />
	);
};

export default PropertyTasks;