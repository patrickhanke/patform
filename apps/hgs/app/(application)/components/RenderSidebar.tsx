'use client';

import React, { useContext } from 'react'
import Logo from './Logo'
import { Sidebar } from '@repo/ui'
import { AppContext } from '@provider';
import styles from '../Layout.module.scss'

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

const RenderSidebar = () => {
  return (
	<div className={styles.sidebar_container} id='sidebar'>
		<div className={styles.sidebar_header}>
			<Logo />
		</div>
		<Sidebar menuItems={menu_items} />
	</div >
  )
}

export default RenderSidebar