'use client';

import React, { useContext, useState } from 'react';
import { AppContext } from '@repo/provider';
import { Page } from '@repo/ui';
import pages_states from './constants/page_states';
import WebsiteSettings from './content/WebsiteSettings';
import { PageState } from '@repo/types';

const Website = () => {
	const {currentModule} = useContext(AppContext);
	const [activeState, setActiveState] = useState<PageState>(pages_states[0] as PageState);

	return (
		<Page 
			title={currentModule.name}
			// pageHeaderContent={}
			emptyContent={true}
			pageStates={pages_states}
			activeState={activeState}
			navOnClick={setActiveState}
		>
			{activeState.value ==='settings' && 
			<WebsiteSettings />
			}
			
		</Page>
	);
};

export default Website;