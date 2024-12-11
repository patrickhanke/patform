import React from 'react';
import '@styles/global.scss';
import '@styles/fonts.scss';
import styles from './Layout.module.scss';
import clsx from 'clsx';

import LayoutContext from './LayoutContext';
import Logo from './components/Logo';
import './styles.scss';
import '@styles/buttons.scss';
import { Sidebar, SiteHeader } from '@repo/ui';

// const ws = new WebSocket('wss://pg-app-ks588wtqbcwvgvbc096gr40cedytjy.scalabl.cloud/1/');

// ws.onopen = () => {
// 	console.log('Connected to WebSocket server');
// 	ws.send('Hello Server!');
// };
  
// ws.onmessage = (event) => {
// 	console.log('Received from server:', event.data);
// };

// ws.onclose = () => {
// 	console.log('Disconnected from WebSocket server');
// };

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
		value: '/properties',
		icon: 'objects',
		sub_menu: []
	},{
		label: 'Aufgaben',
		value: '/tasks',
		icon: 'tasks'
	},{
		label: 'Tickets',
		value: '/tickets',
		icon: 'tickets'
	},{
		label: 'Zeiterfassung',
		value: '/records',
		icon: 'time'
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
		},{
			label: 'Zeiten und Zuschläge',
			value: '/times',
			icon: 'calendar'
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
				<div className={clsx(styles.layout)}>
					<div className={styles.sidebar_container}>
						<div className={styles.sidebar_header}>
							<Logo />
						</div>
						<Sidebar menuItems={menu_items} />
					</div >
					<LayoutContext>
						<div className={styles.main_content}>
							<div className={styles.content_container}>
								<SiteHeader />
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