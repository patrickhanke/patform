import React from 'react';
import styles from './Layout.module.scss';
import '@repo/styles/global';
import '@repo/styles/fonts';

export const metadata = {
	title: 'Saaman Testportal',
	description: 'PH'
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