'use client';

import styles from './UserDisplay.module.scss';
import { MessageIndicator } from '@repo/ui';
import { FC, useCallback, useEffect, useState } from 'react';
import { axiosclient, getImageUrl } from '@repo/provider';
import { UserDisplayProps } from './types';
import UserSettings from './components/UserSettings';
import { PatstoreUser } from '@repo/types';

const UserDisplay: FC<UserDisplayProps> = ({userMessages=false}) => {
	const [userSettings, setUserSettings] = useState(false);
	const [user, setUser] = useState<PatstoreUser | null>(null);
	const getUser = useCallback(async () => {
		await axiosclient().get('/users/me')
			.then(response => {
				setUser( response.data );
			})
			.catch(error => console.error(error.message));
	
	}, [])

	const userShort = (username: string) => {
		const nameParts = username.split(' ');
		if (nameParts.length === 1 && nameParts[0]) {
			return nameParts[0][0];
		} else if (nameParts.length > 1 && nameParts[0] && nameParts[nameParts.length - 1] && nameParts[nameParts.length - 1]?.length > 0) {
			return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
		}

		return 'U'
	}

	useEffect(() => {
		getUser();
	}, []);

	if (!user) {
		return null;
	}

	return ( 
		<>
			<div className={styles.user_container} onClick={() => setUserSettings(true)}>
				<div className={styles.user_image_container} >
					{user.portrait ? 
						<img
							src={getImageUrl({filePath: user?.portrait, width: 60, height: 60})}
							alt={user.label}
							width={'24px'}
							height={'24px'}
						/>
						: 
						<div className={styles.display_user_no_image} data-onlyimage={true}>
							<div className={styles.display_user_no_image_background} style={{backgroundColor: '#B3DAF9'}} />
							<div className={styles.display_user_no_image_character} style={{color: '#0D3A7F'}}>{userShort(user.label)}</div>
						</div>
					}
				</div>
				{userMessages && <MessageIndicator />}
			</div>
			{user && <UserSettings user={user} userSettings={userSettings} setUserSettings={setUserSettings} getUser={getUser} />}
		</>
	);
};

export default UserDisplay;