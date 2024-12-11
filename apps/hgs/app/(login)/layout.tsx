import React from 'react';
import styles from './Layout.module.scss';
import '@styles/global.scss';
import '@styles/fonts.scss';

export const metadata = {
	title: 'HGS App',
	description: 'Aufgabenverwaltung für Hausmeister'
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