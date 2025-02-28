import { PageNavigationProps } from './types';
import './styles.scss';
import { SwitchButtons } from '@repo/ui';

const PageNavigation = ({siteStates = [], activeState, onClick}: PageNavigationProps) => {
	if (siteStates.length > 0) return (
		<div className='nav_container_underline'>
			<div className='site_navigation_container'>
				<SwitchButtons
					buttonStates={siteStates}
					currentStates={activeState}
					changeHandler={(value: PageNavigationProps['activeState']) => onClick(value)}
					underlineButtons
					useFragment
				/>
			</div>
		</div>
	); 
	return null;
};

export default PageNavigation;