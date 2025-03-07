'use client';

import { useContext, useState } from 'react';
import styles from './SiteHeader.module.scss';
import { SiteHeaderComponent } from './types';
import { AppContext } from '@repo/provider';
import AddProject from './components/AddProject';
import { UserDisplay } from './content/UserDisplay';

const SiteHeader = ({
	title 
}: SiteHeaderComponent) => {
	const {pageTitle} = useContext(AppContext);

	return (
		<>
			<div className={styles.main_container} >
				<div className={styles.siteheader_container}>
					<h1>
						{pageTitle || title}
					</h1>
					<div className={styles.siteheader_right_container}>
						<UserDisplay />
					</div>
				</div>
			</div>
		</>
	);
};

export default SiteHeader;