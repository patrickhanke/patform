'use client';

import React, { useContext, useEffect } from 'react';
import styles from './SiteHeader.module.scss';
import { SiteHeaderComponent } from './types';
import { Plus, RotateCcw } from 'lucide-react';
import { isArray } from 'lodash';
import { AppContext } from '@/provider';
import SiteNavigation from './content/SiteNavigation';
import clsx from 'clsx';
import CalendarWeek from './components/CalendarWeek';
import { UserDisplay } from '../UserDisplay';

const SiteHeader = ({
	title, 
	siteHeaderContent, 
	siteHeaderButtons, 
	hasSiteNavigation = false,
	isSubHeader = false,
	navItems = [], 
	navCurrentItem, 
	navOnClick,
	refetch,
	emptyContent=false
}: SiteHeaderComponent) => {
	const {createTask, createTicket, setRefetchFunction, selectYear} = useContext(AppContext);
	
	useEffect(() => {	
		if (refetch) {
			setRefetchFunction(() => refetch);
		}
	}, [refetch]);
	
	return !isSubHeader ? 
		<div className={styles.main_container} data-hassitenav={hasSiteNavigation} >
			<div className={styles.siteheader_container}>
				<h1>
					{title}
				</h1>
				<div className={styles.siteheader_right_container}>
					{createTask}
					<div className='vertical_line' />
					{createTicket}
					<div className='vertical_line' />
					{selectYear}
					<div className='vertical_line' />
					<CalendarWeek />
					<div className='vertical_line' />
					<UserDisplay />
				</div>
			</div>
			{hasSiteNavigation &&  
				<div className={styles.nav_container_underline}>
					<SiteNavigation items={navItems} currentItem={navCurrentItem} onClick={navOnClick} />
					<div className='button_container' style={{marginBottom: 6}}>
						{isArray(siteHeaderButtons) && siteHeaderButtons?.length > 0 && siteHeaderButtons.map(button => (
							<button
								key={button.text}
								data-color={button.color || 'primary'}
								className={clsx('border_button', 'md', 'dark', styles.siteheader_createbutton)}
								onClick={() => button.onClick()}
								disabled={button.disabled}
							>
								{button.is_add_button && <div className={styles.add_icon}><Plus strokeWidth={1} size={12} /></div> }
								{button.is_reset_button && <div className={styles.add_icon}><RotateCcw strokeWidth={1} size={12} /></div> }
								<span>{`${button.text}`}</span>
							</button>
						))}
					</div>
				</div>
			}
		</div>
		:
		<div className={styles.siteheader_content_container}>
			{siteHeaderContent || emptyContent && 
				<div>
					{siteHeaderContent}
				</div> 
			}
			<div className={styles.siteheader_button_container} >
				{isArray(siteHeaderButtons) && siteHeaderButtons?.length > 0 && siteHeaderButtons.map(button => (
					<button
						key={button.text}
						data-color={button.color || 'primary'}
						className={clsx('border_button', 'md', 'dark', styles.siteheader_createbutton)}
						onClick={() => button.onClick()}
						disabled={button.disabled}
					>
						{button.is_add_button && <div className={styles.add_icon}><Plus strokeWidth={1} size={12} /></div> }
						{button.is_reset_button && <div className={styles.add_icon}><RotateCcw strokeWidth={1} size={12} /></div> }
						<span>{`${button.text}`}</span>
					</button> 
				))}
			</div>
		</div>;
};

export default SiteHeader;