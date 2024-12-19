'use client';

import Link from 'next/link';

const Admin = () => {
	const user = 'user'
        
	if (user) return (
		<div className={'admin_container'}>
			<Link className={'menu_item'} href={'/admin'}>
				Admin
			</Link>
		</div>
	);

	return null;
};

export default Admin;