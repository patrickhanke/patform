import { GET_USER_DISPLAY_DATA } from '@queries';
import { useQuery } from '@apollo/client';
import React, { useMemo } from 'react';
import DisplayUserData from './components/DisplayUserData';
import styles from './StaffMemberOverview.module.scss';
import clsx from 'clsx';

const StaffMemberOverview = ({userId}: {userId: string}) => {
	const {data} = useQuery(GET_USER_DISPLAY_DATA, {variables: {id: userId}});

	const createUserDisplayData = useMemo(() => {	
		if (data) {
			return {
				Vorname: data.objects.get_User.first_name || '' as string,
				Nachname: data.objects.get_User.family_name || '' as string,
				Rolle: data.objects.get_User.role.name || '' as string,
				'E-Mail': data.objects.get_User.email || '' as string
			} as const;
		}
		return null;
	}, [data]);

	return (
		<div className='site_content'>
			<div className={styles.overview_container}>
				<div className={clsx(styles.user_data_container)}>
					<h3>Allgemeine Daten</h3>
					{createUserDisplayData && Object.keys(createUserDisplayData).map((key) => {
						const typedKey = key as keyof typeof createUserDisplayData;
						return (
							<DisplayUserData key={key} label={key} value={createUserDisplayData[typedKey]} />
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default StaffMemberOverview;