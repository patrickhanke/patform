import React from 'react';
import '@repo/styles/global';
import '@repo/styles/layout';

import LayoutContext from './components/LayoutContext';
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
				<div className='layout'>
					<LayoutContext>
						<RenderSidebar />
						<div className='main_content' id='main_content'>
							<div className='content_container' id='page_content'>
								<SiteHeader />
								<div className='content' id='content'>
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