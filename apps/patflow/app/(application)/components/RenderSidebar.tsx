'use client';

import React from 'react'
import Logo from './Logo'
import { Sidebar } from '@repo/ui'

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
		icon: 'tasks',
		sub_menu: [{
			label: 'Aktiv',
			value: '/active',
			icon: 'active',
		},{
			label: 'Erledigt',
			value: '/excecuted',
			icon: 'executed',
		},{
			label: 'Geschlossen',
			value: '/completed',
			icon: 'completed'
		},{
			label: 'Archiviert',
			value: '/archived',
			icon: 'archived'
		}]
	},{
		label: 'Tickets',
		value: '/tickets',
		icon: 'tickets',
		sub_menu: [{
			label: 'Offen',
			value: '/open',
			icon: 'active',
		},{
			label: 'In Bearbeitung',
			value: '/in_progress',
			icon: 'executed',
		},{
			label: 'Geschlossen',
			value: '/closed',
			icon: 'closed'
		}]
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
		label: 'Nutzerverwaltung',
		value: '/user_management',
		icon: 'users',
		divider: 'Einstellungen',
	},{
		label: 'Zeiten und Zuschläge',
		value: '/times',
		icon: 'calendar'
	},{
		label: 'Leistungsverzeichnisse',
		value: '/services',
		icon: 'services',
		disabled: true
	}
];

const RenderSidebar = () => {
	return (
		<div className='layout_sidebar_container' id='sidebar'>
			<div className='layout_sidebar_header'>
				<Logo />
			</div>
			<Sidebar menuItems={menu_items} />
		</div >
	)
}

export default RenderSidebar