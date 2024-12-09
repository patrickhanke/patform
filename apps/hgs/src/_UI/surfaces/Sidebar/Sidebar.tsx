import React from 'react';
import styles from './Sidebar.module.scss';
import { menu_items } from '@/provider';
import MenuItem from './components/MenuItem';
import Logout from './components/Logout';
import { MenuItemType } from './types';

const Sidebar = () => {
	return (
		<div className={styles.sidebar_container}>
			<ul className={styles.menu_item_container}>
				{menu_items.map((menu_item: MenuItemType) => (
					<MenuItem
						key={menu_item.value}
						link={menu_item.value }
						label={menu_item.label}
						icon={menu_item.icon}
						subMenu={menu_item.sub_menu}
						disabled={menu_item.disabled}
					/>
						
				))}
			</ul>
			<ul className={styles.menu_item_container}>
				<li>
					<Logout />
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;