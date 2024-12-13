'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import styles from '../Sidebar.module.scss';
import {IoMdArrowDropdown} from 'react-icons/io';
import { MenuItemProps, MenuItemType } from '../types';
import Icons from '../constants/Icons';
import '../styles.scss';

const MenuItem = ({link, label, icon, subMenu = [], disabled = false}: MenuItemProps) => {
	const [showSubMenu, setShowSubMenu] = useState(false);
	const pathname = usePathname();
	
	const path = useMemo(() => {
		let pathString = pathname;
		const sliceIndex = pathname.slice(1).search('/'); 
		if (sliceIndex !== -1) {
			pathString = pathname.slice(0, sliceIndex + 1);
		}

		return pathString;
	}, [pathname]);

	const subMenuHandler = (subMenuValue : string, pathname: string) => {
		const sliceIndex = pathname.slice(1).search('/'); 
		if (sliceIndex !== -1) {
			const pathString = pathname.slice(sliceIndex + 1);
			if (subMenuValue === pathString) {
				return true;
			}
			return false;
		}
		return false;
	};

	return (
		<>
			<li data-hassubmenu={subMenu.length > 0} style={{marginBottom: subMenu.length > 0 && showSubMenu ? 0 : 4.8}}>
				{subMenu.length > 0 || disabled ? 
					<button 
						data-disabled={disabled} 
						onClick={() => setShowSubMenu(!showSubMenu)}  
						className={clsx(link === path ? [styles.menu_item, styles.menu_item_active] : styles.menu_item)}
					>
						<Icons icon={icon} />
						<div className='sidebar_label'>{label}</div>
						{!disabled && 
							<div className='sidebar_dropicon' data-showsubmenu={showSubMenu}>
								<IoMdArrowDropdown />
							</div>
						}
					</button>
					:
					<Link
						aria-disabled={disabled}
						as={link}
						className={clsx(link === path ? [styles.menu_item, styles.menu_item_active] : styles.menu_item)}
						href={link}
					>
						<Icons icon={icon} />
						<div className={'sidebar_label'}>{label}</div>
					</Link>
				}
			</li>
			<div className={styles.submenu_container} data-showsubmenu={showSubMenu}>
				<ul>
					{subMenu.length > 0 && subMenu.map((subMenuItem : MenuItemType['sub_menu'][number]) =>
						<li key={subMenuItem.value}>
							{!subMenuItem.disabled ? 
								<Link className={clsx(subMenuHandler(subMenuItem.value, pathname) ? [styles.menu_item, styles.menu_item_active] : styles.menu_item)} href={`${link}${subMenuItem.value}`}>
									<Icons icon={subMenuItem.icon} />
									<div className='sidebar_label'>{subMenuItem.label}</div>
								</Link>
								:	
								<div data-disabled={subMenuItem.disabled} className={clsx(subMenuHandler(subMenuItem.value, pathname) ? [styles.menu_item, styles.menu_item_active] : styles.menu_item)}>
									<Icons icon={icon} />
									<div className='sidebar_label'>{subMenuItem.label}</div>
								</div>
							}
						</li>
					)}
				</ul>
			</div>
		</>
	);
};

export default MenuItem;