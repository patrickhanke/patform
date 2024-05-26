import { SiteNavigation as SiteNavigationComponent } from './types';
import './styles.scss';
import { SwitchButtons } from '@repo/ui';

const SiteNavigation = ({items = [], currentItem, onClick}: SiteNavigationComponent) => {
	if (items.length > 0) return <div className='site_navigation_container'>
		<SwitchButtons 
			buttonStates={items}
			currentStates={currentItem}
			changeHandler={value => onClick(value)}
		/>
	</div>; 
	return null;
};

export default SiteNavigation;