import { SiteNavigation, item } from '../types';
import '../styles.scss';

const NavigationElement = ({item, onClick, currentItem} : {item: item, onClick: SiteNavigation['onClick'], currentItem: SiteNavigation['currentItem']}) => {
  
	return (
		<button data-isactive={item.value === currentItem.value} className={'navigation_element_container'} onClick={() => onClick(item)}>
			<div className={'title_container'} >{item.label}</div>
		</button>
	);
};

export default NavigationElement;