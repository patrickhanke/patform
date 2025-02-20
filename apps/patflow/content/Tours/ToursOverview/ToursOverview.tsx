'use client';

import React, { useContext, useMemo, useState } from 'react';
import { Page } from '@repo/ui';
import { PageState } from '@repo/types';
import page_states from './constants/page_states';
import ServiceSettings from './content/ServiceSettings';
import { UserContext } from '@repo/provider';
import Services from './content/Services';

const ToursOverview = () => {
	const {projectId} = useContext(UserContext)
	const [createService, setCreateService] = useState<boolean>(false);
	const [pageState, setPageState] = useState<PageState>(page_states[0] as PageState);

	const pageHeaderButtons = useMemo(() => {
		if (pageState.value === 'settings') {
			return [
				{
					text: 'Service erstellen',
					onClick: () => setCreateService(true)
				}
			]
		}
	}, [pageState]);

	return (
		<Page 
			title='Touren'
			pageState={pageState}
			pageStates={page_states}
			setPageState={setPageState}
			pageHeaderButtons={pageHeaderButtons}

		>
			{pageState.value === 'services' && (
				<>
					<Services />
				</>
			)}
			{pageState.value === 'settings' && (
				<ServiceSettings projectId={projectId} createService={createService} setCreateService={setCreateService} />
			)}
		</Page>
	);
};

export default ToursOverview;