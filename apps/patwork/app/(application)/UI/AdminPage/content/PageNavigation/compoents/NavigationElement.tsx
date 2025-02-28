import { PageNavigationProps, SiteState } from '../types';
import '../styles.scss';

const NavigationElement = ({item, onClick, currentItem} : {item: SiteState, onClick: PageNavigationProps['onClick'], currentItem: PageNavigationProps['currentItem']}) => {
  
	return (
		<button data-isactive={item.value === currentItem.value} className={'navigation_element_container'} onClick={() => onClick(item)}>
			<div className={'title_container'} >{item.label}</div>
		</button>
	);
};

export default NavigationElement;