'use client';

import React, { useContext } from 'react';
import styles from './SiteHeader.module.scss';
import { SiteHeaderComponent } from './types';
import { AppContext, UserContext } from '@repo/provider';
import { UserDisplay } from '@repo/ui';

const SiteHeader = ({
	title 
}: SiteHeaderComponent) => {
	const {pageTitle} = useContext(AppContext);
	const {user} = useContext(UserContext);

	console.log(user);
	
	
	return (
		<div className={styles.main_container} >
			<div className={styles.siteheader_container}>
				<h1>
					{pageTitle || title}
				</h1>
				<div className={styles.siteheader_right_container}>
					<div className='vertical_line' />
					<UserDisplay user={user} />
				</div>
			</div>
		</div>
	);
};

export default SiteHeader;