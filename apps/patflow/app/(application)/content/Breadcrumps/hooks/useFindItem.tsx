import { menu_items } from '@provider';
import { menuItem } from '@types';
import { useCallback } from 'react';

const useFindItem = () => {

	const findItemLabel = useCallback((pathArrayElement: string, dynamicItems: Array<{value:string, label: string}>) => {
		let label = '';
		const allMenuItems: Array<menuItem | menuItem['sub_menu'][number]>  = [];
		menu_items.forEach(menuItem => {
			if (menuItem.sub_menu.length > 0) {
				menuItem.sub_menu.forEach(subMenuItem => {
					allMenuItems.push(subMenuItem);
				});
			}
			allMenuItems.push(menuItem);
		});
		const allItems = [...allMenuItems, ...dynamicItems];
        
		label = allItems.find(item => `/${pathArrayElement}` === item.value)?.label || pathArrayElement;
    
		return label;
	}, []);


	return findItemLabel;
};

export default useFindItem;