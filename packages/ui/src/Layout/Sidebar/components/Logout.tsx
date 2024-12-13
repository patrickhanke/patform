'use client';

import { BiLogOut } from 'react-icons/bi';
import styles  from '../Sidebar.module.scss';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { axiosclient } from '@repo/provider';

const Logout = () => {
	const router = useRouter();

	const logoutUser = async () => {
		Cookies.remove(process.env.SESSION_TOKEN);
		Cookies.remove(`${process.env.SESSION_TOKEN}_logged_in`);
		await axiosclient().post('logout');
		return router.push('/login');
	};

	return (
		<div onClick={() => logoutUser()}  className={styles.menu_item}>
			<BiLogOut /> <div className='sidebar_label'>Logout</div>
		</div>
	);
};

export default Logout;