import React from 'react';
import '@repo/styles/global';
import '@repo/styles/typography';
import '@repo/styles/buttons';
import styles from './Layout.module.scss';

import LayoutContext from './LayoutContext';
import Logo from './components/Logo';
import './styles.scss';
import Sidebar from './content/Sidebar';

export const metadata = {
	title: 'Hausmeister App',
	description: 'PH'
};


const menu_items = [
	{
		label: 'Dashboard',
		value: '/',
		icon: 'dashboard',
		sub_menu: []
	},{
		label: 'Objekte',
		value: '/objects',
		icon: 'objects',
		sub_menu: []
	},{
		label: 'Aufgaben',
		value: '/tasks',
		icon: 'tasks',
		sub_menu: []
	},{
		label: 'Tickets',
		value: '/tickets',
		icon: 'tickets',
		sub_menu: []
	},{
		label: 'Touren',
		value: '/tours',
		icon: 'tours',
		sub_menu: [],
		disabled: true
	},{
		label: 'Mitarbeiter',
		value: '/staff',
		icon: 'staff',
		sub_menu: []
	},{
		label: 'Einstellungen',
		value: '/settings',
		icon: 'settings',
		sub_menu: [{
			label: 'Leistungsverzeichnisse',
			value: '/services',
			icon: 'services',
			disabled: true
		},{
			label: 'Müll',
			value: '/waste',
			icon: 'waste',
			disabled: true
		},{
			label: 'Nutzerverwaltung',
			value: '/user_management',
			icon: 'users'
		}]
	}
];

export default async function  RootLayout({
	children
}: {
	children: React.ReactNode,
}) {
	return (
		<html lang="de">
			<body>
				<div className={styles.layout}>
					<div className={styles.sidebar_container}>
						<div className={styles.sidebar_header}>
							<Logo />
						</div>
						<Sidebar menuItems={menu_items} />
					</div >
					<LayoutContext>
						<div className={styles.main_content}>
							<div className={styles.content_container}>
								<div className={styles.content}>
									{children}
								</div>
							</div>
						</div>
					</LayoutContext>
				</div>
			</body>
		</html>
	);
}