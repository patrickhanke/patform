'use client';

import React from 'react';
import { BiLogOut } from 'react-icons/bi';
import styles  from '../Sidebar.module.scss';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { axiosclient } from '@/provider';

const Logout = () => {
	const router = useRouter();

	const logoutUser = async () => {
		Cookies.remove('hgs_token');
		Cookies.remove('hgs_logged_in');
		await axiosclient().post('logout');
		return router.push('/login');
	};

	return (
		<div onClick={() => logoutUser()}  className={styles.menu_item}>
			<BiLogOut /> Logout
		</div>
	);
};

export default Logout;