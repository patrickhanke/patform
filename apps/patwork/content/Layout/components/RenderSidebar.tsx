'use client';

import React from 'react'
import Logo from './Logo'
import { MenuItem, Sidebar } from '@repo/ui'

const RenderSidebar = ({menuItems}: {menuItems: MenuItem[]}) => {
  return (
	<div className={'layout_sidebar_container'} id='sidebar'>
		<div className={'layout_sidebar_header'}>
			<Logo />
		</div>
		<Sidebar menuItems={menuItems} />
	</div >
  )
}

export default RenderSidebar