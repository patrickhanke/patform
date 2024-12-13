import React from 'react';
import '@styles/global.scss';
import '@styles/fonts.scss';
import styles from './Layout.module.scss';
import clsx from 'clsx';

import LayoutContext from './LayoutContext';
import Logo from './components/Logo';
import './styles.scss';
import '@styles/buttons.scss';
import { Sidebar } from '@repo/ui';
import SiteHeader from './content/SiteHeader';
import { AppContext } from '@provider';
import RenderSidebar from './components/RenderSidebar';

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

export default async function  RootLayout({
	children
}: {
	children: React.ReactNode,
}) {
	return (
		<html lang="de">
			<body>
				<div className={clsx(styles.layout)}>
					<LayoutContext>
						<RenderSidebar />
						<div className={styles.main_content}>
							<div className={styles.content_container}>
								<SiteHeader />
								<div className={styles.content} id='content'>
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