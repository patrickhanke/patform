'use client';

import React, { useContext } from 'react';
import { AppContext } from '../../provider';

const Playground = () => {
	const {projects} = useContext(AppContext);
	console.log(projects);
	return (
		<div>Playground</div>
	);
};

export default Playground;