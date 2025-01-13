'use client';

import React from 'react'
import Logo from './Logo'
import { MenuItem, Sidebar } from '@repo/ui'

const RenderSidebar = ({menuItems, logo}: {menuItems: MenuItem[], logo: {name: string, url: string}}) => {
  return (
	<div className={'sidebar_container'} id='sidebar'>
		<div className={'sidebar_header'}>
			<Logo logo={logo} />
		</div>
		<Sidebar menuItems={menuItems} />
	</div >
  )
}

export default RenderSidebar