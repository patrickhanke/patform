'use client';

import React from 'react';
import styles from '../Sidebar.module.scss';
import Link from 'next/link';

const Admin = () => {
	const user = 'user'
        
	if (user) return (
		<div className={styles.admin_container}>
			<Link className={styles.menu_item} href={'/admin'}>
				Admin
			</Link>
		</div>
	);

	return null;
};

export default Admin;