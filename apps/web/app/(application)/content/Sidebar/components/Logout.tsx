'use client';

import React from 'react';
import { BiLogOut } from 'react-icons/bi';
import styles  from '../Sidebar.module.scss';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { axiosclient } from '@repo/provider';

const Logout = () => {
	const router = useRouter();

	const logoutUser = async () => {
		Cookies.remove('hgs_token');
		Cookies.remove('hgs_logged_in');
		await axiosclient(
			'',
			process.env.SASHIDO_API_URL as string,
			process.env.SASHIDO_APP_ID as string,
			process.env.SASHIDO_REST_KEY as string,
			process.env.SASHIDO_MASTER_KEY as string
		
		).post('logout');
		return router.push('/login');
	};

	return (
		<div onClick={() => logoutUser()}  className={styles.menu_item}>
			<BiLogOut /> Logout
		</div>
	);
};

export default Logout;