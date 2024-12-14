import styles from './Sidebar.module.scss';
import MenuItem from './components/MenuItem';
import Logout from './components/Logout';
import { MenuItemType } from './types';
import { ReactNode } from 'react';
import { BsArrowLeftRight } from 'react-icons/bs';
import { Divider } from '../Divider';

const Sidebar = ({menuItems, children}: {menuItems: {label: string, value: string, icon: string}[], children?: ReactNode}) => {
	return (
		<div className={styles.sidebar_container}>
			<div>
				<ul className={styles.menu_item_container}>
					<li>
						<div
							className={styles.menu_item}
							onClick={() => {
								const sidebar = document.getElementById('sidebar');
								if (sidebar) {
									sidebar.classList.toggle(styles.sidebar_open);
								}
								const sidebarLabels = document.querySelectorAll('.sidebar_label');
								sidebarLabels.forEach(label => {
									label.classList.toggle('sidebar_label_open');
								});
								const sidebarDropicons = document.querySelectorAll('.sidebar_dropicon');
								sidebarDropicons.forEach(label => {
									label.classList.toggle('sidebar_dropicon_open');
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
						<div className={styles.menu_content_container}>
							{children}
						</div>
					}
					<ul className={styles.menu_item_container}>
						{[...menuItems].map((menu_item: MenuItemType) => (
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
				</div>
			</div>
			<ul className={styles.menu_item_container}>
				<li>
					<Logout />
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;