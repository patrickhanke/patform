'use client';

import React, { useContext, useMemo } from 'react'
import Logo from './Logo'
import { MenuItem, Sidebar } from '@repo/ui'
import { ProjectContext } from '@repo/provider';
import { Module, Project, User } from '@repo/types';


const RenderSidebar = () => {
	const {project} = useContext(ProjectContext)

	const menuItems =  useMemo(() => {
		const menuItemsArray: {value: string, label: string, icon: string}[] = [];
		if (project) {

			project.modules.results.forEach((module: Module) => {
				menuItemsArray.push({
				label: module.name,
				icon: module.icon,
				value: module.path
			})
		})
		}

		return menuItemsArray
	}, [project])

	if (!project) {
		return null
	}
 	
	return (
		<div className={'layout_sidebar_container'} id='sidebar'>
			<div className={'layout_sidebar_header'}>
				<Logo logo={project.logo} />
			</div>
			<Sidebar menuItems={menuItems} />
		</div >
  )
}

export default RenderSidebar