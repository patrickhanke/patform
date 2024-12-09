import Tallies from '@/_UI/Tallies';
import React from 'react';

const PropertyTallies = ({objectId}: {objectId: string}) => {
	return <Tallies id={objectId} className={'Property'} />;
};

export default PropertyTallies;