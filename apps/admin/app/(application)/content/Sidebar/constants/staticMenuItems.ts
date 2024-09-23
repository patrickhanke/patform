import { MenuItemType } from '../types';

const staticMenuItems = [
	{
		value: 'app-settings',
		label: 'App Settings',
		icon: 'settings',
		sub_menu: [
			{
				value: '/project',
				label: 'Projekt',
				icon: 'project'
			},
			{
				value: '/modules',
				label: 'Module',
				icon: 'modules'
			},
			{
				value: '/users',
				label: 'Users',
				icon: 'users',
			},
			{
				value: '/roles',
				label: 'Roles',
				icon: 'settings',
				disabled: true
			}
			
		]
	}
  
] as MenuItemType[];

export default staticMenuItems;