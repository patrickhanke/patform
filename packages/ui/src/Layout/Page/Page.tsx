'use client';

import {PageHeader} from './content/PageHeader';
import { PageProps } from './types';
import './styles.scss';
import { PageNavigation } from './content/PageNavigation';
import CreateClass from './content/PageHeader/content/CreateClass';
import { useEffect } from 'react';

const Page = ({
	title, 
	children,
	pageHeaderButtons, 
	pageStates = [], 
	pageState, 
	setPageState,
	pageHeaderContent, 
	createClass,
	refetch,
	emptyContent=false
}: PageProps) => {
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 100) {
				// handle scroll position greater than 100
				console.log('scroll1');
				
			} else {
				console.log('scroll2');
				
				// handle scroll position less than or equal to 100
			}
		};
	
		window.addEventListener('scroll', handleScroll);
	
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<>
			<div className='page_header_container'>
				<PageHeader
					title={title}
					pageHeaderButtons={pageHeaderButtons}
					pageStates={pageStates}
					pageState={pageState}
					setPageState={setPageState}
					pageHeaderContent={pageHeaderContent}
					createClass={createClass}
					refetch={refetch}
					emptyContent={emptyContent}
				/>
			</div>
			
			<div className='page-content' id='content'>
				{children}
			</div>
		</>
	);
};

export default Page;