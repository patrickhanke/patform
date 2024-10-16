import styles from './UserDisplay.module.scss';
import { User } from '@repo/types';

const UserDisplay = ({user}: {user: User }) => {
	
	return user && typeof user === 'object' ? 
		<a
			href={`/staff/${user?.objectId}`}
			role='button'
			aria-hidden="true"
			tabIndex={0}
			className={styles.user_container}
		>
			<div className={styles.user_image_container} >
				{user.portrait && 
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={`${user.portrait.fileUrl}?w=36&h=36`}
					alt={`${user.first_name} ${user.family_name}`}
					width={'24px'}
					height={'24px'}
				/>
				}
			</div>
			{/* <MessageIndicator messages={userMessages} /> */}
			{/* <h4 style={{fontSize: '12px', fontWeight: 600}}>{`${user.first_name} ${user.family_name}`}</h4> */}
		</a>
		: 
		null;
};

export default UserDisplay;