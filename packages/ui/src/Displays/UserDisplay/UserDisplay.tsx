'use cient';

import styles from './UserDisplay.module.scss';
import { MessageIndicator } from '@repo/ui';
import { useContext } from 'react';
import { UserContext, getImageUrl } from '@repo/provider';

const UserDisplay = () => {
	const {user} = useContext(UserContext);
	

	if (!user) {
		return null;
	}

	return ( 
		<div className={styles.user_container}>
			<div className={styles.user_image_container} >
				{user.portrait && 
				<img
					src={getImageUrl({filePath:user.portrait, width: 60, height: 60})}
					alt={`${user.first_name} ${user.family_name}`}
					width={'24px'}
					height={'24px'}
				/>
				}
			</div>
			<MessageIndicator />
			{/* <h4 style={{fontSize: '12px', fontWeight: 600}}>{`${user.first_name} ${user.family_name}`}</h4> */}
		</div>
	);
};

export default UserDisplay;