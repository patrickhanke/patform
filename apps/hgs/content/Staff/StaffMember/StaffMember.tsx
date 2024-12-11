'use client';

import { GET_USER } from '@queries';
import { useQuery } from '@apollo/client';
import React, { useContext, useMemo, useState } from 'react';
import useWorkerSiteStates from './hooks/useWorkerSiteStates';
import UserSettings from './content/UserSettings';
import StaffMemberOverview from './content/StaffMemberOverview';
import { Params } from '@types';
import StaffMemberTimes from './content/StaffMemberTimes';
import { UserContext } from '@provider';
import { SiteState } from '@repo/types';
import { SiteHeader } from '@repo/ui';

const StaffMember = ({params} : {params: Params}) => {
	const {data, loading} = useQuery (
		GET_USER, 
		{
			variables: {id: params.user_id}, 
			fetchPolicy: 'no-cache'
		}
	);
	const siteStates = useWorkerSiteStates();
	const [siteState, setSiteState] = useState<SiteState>(siteStates[0] as SiteState);
	const [createRecord, setCreateRecord] = useState(false);
	const {project} = useContext(UserContext);

	const siteHeaderButtons = useMemo(() => siteState.value === 'times' ? [{
		text: 'Neue Zeiterfassung anlegen',
		onClick: () => setCreateRecord(true)
	}] : [], [siteState]);

	if (loading ||  !project) {
		return <p>Lädt...</p>;
	}
	const user = data.objects.get_User;

	return (
		<>
			<SiteHeader
				title={data && `${data.objects.get_User.first_name} ${data.objects.get_User.family_name}`}
				hasSiteNavigation
				navItems={siteStates} 
				navCurrentItem={siteState} 
				navOnClick={setSiteState}
				siteHeaderButtons={siteHeaderButtons}
				emptyContent
			/>
			{siteState.value === 'overview' && 
				<StaffMemberOverview userId={params.user_id}  />
			}
			{siteState.value === 'settings' && 
				<UserSettings userId={params.user_id}  />
			}
			{siteState.value === 'times' && 
				<StaffMemberTimes
					userId={params.user_id}
					timeSettings={user.time_settings}
					createRecord={createRecord}
					setCreateRecord={setCreateRecord}
					projectId={project.objectId}
				/>
			}
		</>
	);
};

export default StaffMember;