import React from 'react';
import '@styles/global.scss';
import '@styles/fonts.scss';
import styles from './Layout.module.scss';
import clsx from 'clsx';
import Sidebar from '@/_UI/surfaces/Sidebar';

import LayoutContext from './LayoutContext';
import Logo from './components/Logo';
import './styles.scss';
import '@styles/buttons.scss';

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
					<div className={styles.sidebar_container}>
						<div className={styles.sidebar_header}>
							<Logo />
						</div>
						<Sidebar />
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