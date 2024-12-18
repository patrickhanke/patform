import React from 'react';
import '@repo/styles/global';
import '@repo/styles/typography';
import '@repo/styles/buttons';
import './styles.scss';
import styles from './Layout.module.scss';
import clsx from 'clsx';

import LayoutContext from './LayoutContext';
import SiteHeader from './content/SiteHeader';
import RenderSidebar from './components/RenderSidebar';

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
						<div className={styles.main_content} id='main_content'>
							<div className={styles.content_container} id='page_content'>
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