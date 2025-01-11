import React from 'react';
import styles from './Layout.module.scss';
import '@repo/styles/typography';
import '@repo/styles/global';

export const metadata = {
	title: 'patflow',
	description: 'Anwendung für die Verwaltung von Aufgaben und Arbeitszeiten'
};

export default async function  RootLayout({
	children
}: {
	children: React.ReactNode,
}) {
	return (
		<html lang="de">
			<body className={styles.layout}>
				{children}
			</body>
		</html>
	);
}