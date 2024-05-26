import { SiteNavigation as SiteNavigationComponent } from './types';
import './styles.scss';
import { SwitchButtons } from '@repo/ui';

const SiteNavigation = ({siteStates = [], activeState, onClick}: SiteNavigationComponent) => {
	if (siteStates.length > 0) return <div className='site_navigation_container'>
		<SwitchButtons 
			buttonStates={siteStates}
			currentStates={activeState}
			changeHandler={value => onClick(value)}
		/>
	</div>; 
	return null;
};

export default SiteNavigation;