'use client';

import styles from './UserDisplay.module.scss';
import { MessageIndicator } from '@repo/ui';
import { useContext, useEffect, useMemo, useState } from 'react';
import { UserContext, getImageUrl } from '@repo/provider';

const UserDisplay = ({userMessages=false}: {userMessages?: boolean}) => {
	const {user} = useContext(UserContext);
	const [client, setClient] = useState(false);

	const userData = useMemo(() => {
		if (user && user.portrait) {
			return ({
				url: getImageUrl({filePath: user.portrait, width: 60, height: 60}),
				alt: `${user.first_name} ${user.family_name}`
			});
		}
		return {
			url: '',
			alt: ''
		};
	}, [user]);

	useEffect(() => {
		setClient(true);
	}, []);
	
	return ( 
		<div className={styles.user_container}>
			<div className={styles.user_image_container} >
				{client && userData.url ? 
					<img
						src={userData.url}
						alt={userData.alt}
						width={'24px'}
						height={'24px'}
					/>
					: 
					<div className={styles.user_image_placeholder} />
				}
			</div>
			{userMessages && <MessageIndicator />}
			{/* <h4 style={{fontSize: '12px', fontWeight: 600}}>{`${user.first_name} ${user.family_name}`}</h4> */}
		</div>
	);
};

export default UserDisplay;