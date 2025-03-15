import React from 'react';
import '@repo/styles/global';
import '@repo/styles/layout';

import LayoutContext from './components/LayoutContext';
import SiteHeader from './content/SiteHeader';
import RenderSidebar from './components/RenderSidebar';
import Head from 'next/head';

export const metadata = {
    title: 'patflow',
    description: 'PH',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
            <Head>
                <link
                    rel="icon"
                    href="/favicon.ico"
                />
                <title>patflow</title>
            </Head>
            <body>
                <div className="layout">
                    <LayoutContext>
                        <RenderSidebar />
                        <div
                            className="main_content"
                            id="main_content"
                        >
                            <div
                                className="content_container"
                                id="page_content"
                            >
                                <SiteHeader />
                                <div
                                    className="content"
                                    id="content"
                                >
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
