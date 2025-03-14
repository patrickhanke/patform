'use client';

import MenuItem from './components/MenuItem';
import { MenuItem as MenuItemType, SidebarProps } from './types';
import { FC } from 'react';
import { BsArrowLeftRight } from 'react-icons/bs';
import { Divider } from '../Divider';
import './styles.scss';

const Sidebar: FC<SidebarProps> = ({menuItems, user, children, appVersion = '1.0.0', appName = 'patstore'}) => {

	return (
		<div className='sidebar_container'>
			<div>
				<ul className='menu_item_container'>
					<li>
						<div
							className='menu_item'
							onClick={() => {
								const sidebar = document.getElementById('sidebar');
								if (sidebar) {
									sidebar.classList.toggle('sidebar_open');
								}
								const sidebarLabels = document.querySelectorAll('.sidebar_label');
								sidebarLabels.forEach(label => {
									label.classList.toggle('sidebar_label_open');
								});
								const sidebarDropicons = document.querySelectorAll('.sidebar_dropicon');
								sidebarDropicons.forEach(label => {
									label.classList.toggle('sidebar_dropicon_open');
								});
								const subMenuItems = document.querySelectorAll('#submenu_item');
								subMenuItems.forEach(subMenuItem => {
									subMenuItem.classList.toggle('submenu_item_open');
									const isOpen = subMenuItem.getAttribute('data-isopen') === 'true';
									subMenuItem.setAttribute('data-isopen', (!isOpen).toString());
								
								});
								
								const mainContent = document.getElementById('main_content');
								if (mainContent) {
									mainContent.classList.toggle('main_content_open');
								}
							}}
						>
							<BsArrowLeftRight />
							<div className='sidebar_label'>
								Einklappen
							</div>
						</div>
					</li>
				</ul>
				<Divider size='none' />
				<div >
					{children &&
						<div className='menu_content_container'>
							{children}
						</div>
					}
					<ul className='menu_item_container'>
						{[...menuItems].map((menu_item: MenuItemType) => (
							<MenuItem
								key={menu_item.value}
								link={menu_item.value }
								label={menu_item.label}
								icon={menu_item.icon}
								subMenu={menu_item.sub_menu}
								disabled={menu_item.disabled}
								divider={menu_item.divider}
							/>
						))}
					</ul>
				</div>
			</div>
			<ul className='menu_item_container'>
				{user?.is_superuser && (
					<li>
						<MenuItem
							link='/admin'
							label='Admin'
							icon='admin'
							subMenu={false}
						/>
					</li>
				)}	
				
				<li>
					<h5>
						patstore v. {appVersion}
					</h5>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;