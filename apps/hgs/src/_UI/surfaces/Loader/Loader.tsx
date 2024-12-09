'use client';

import React from 'react';
import styles from './Loader.module.scss';

const Loader = ({width, height} : {width: string, height: string}) => {
	
	return (
		<div className={styles.loader_container} style={{width: width || 'auto', height: height || 'auto'}}>
		</div>
	);
};

export default Loader;