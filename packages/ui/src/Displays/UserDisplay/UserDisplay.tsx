'use cient';

import styles from './UserDisplay.module.scss';
import { Divider, MessageIndicator } from '@repo/ui';
import { useContext } from 'react';
import { UserContext, getImageUrl } from '@repo/provider';

const UserDisplay = () => {
	const {user, userMessages} = useContext(UserContext);
	
	return user && typeof user === 'object' ? 
		<div
			// href={`/staff/${user.objectId}`}
			// role='button'
			// aria-hidden="true"
			// tabIndex={0}
			className={styles.user_container}
		>
			<span className={styles.user_image_container} >
				{user.portrait && 
				<img
					src={getImageUrl({filePath:user.portrait, width: 60, height: 60})}
					alt={`${user.first_name} ${user.family_name}`}
					width={'24px'}
					height={'24px'}
				/>
				}
			</span>
			<MessageIndicator messages={userMessages} />
			{/* <h4 style={{fontSize: '12px', fontWeight: 600}}>{`${user.first_name} ${user.family_name}`}</h4> */}
		</div>
		: 
		null;
};

export default UserDisplay;