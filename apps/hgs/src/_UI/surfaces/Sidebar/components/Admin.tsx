'use client';

import React, { useContext } from 'react';
import styles from '../Sidebar.module.scss';
import { Icons, UserContext } from '@/provider';
import Link from 'next/link';

const Admin = () => {
	const {user} = useContext(UserContext);
        
	if (user && user.is_superuser) return (
		<div className={styles.admin_container}>
			<Icons icon={'admin'} />
			<Link className={styles.menu_item} href={'/admin'}>
				Admin
			</Link>
		</div>
	);

	return null;
};

export default Admin;