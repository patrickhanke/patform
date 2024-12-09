import React from 'react';
import { SiteNavigation as SiteNavigationComponent } from './types';
import styles from './SiteNavigation.module.scss';
import SwitchButtons from '../SwitchButtons';

const SiteNavigation = ({items = [], currentItem, onClick}: SiteNavigationComponent) => {
	if (items.length > 0) return <div className={styles.site_navigation_container}>
		<SwitchButtons 
			buttonStates={items}
			currentStates={currentItem}
			changeHandler={value => onClick(value)}
		/>
	</div>; 
	return null;
};

export default SiteNavigation;