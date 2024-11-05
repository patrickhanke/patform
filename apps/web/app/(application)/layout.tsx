import React from 'react';
import '@repo/styles/global';
import '@repo/styles/typography';
import '@repo/styles/buttons';
import styles from './Layout.module.scss';
import { ApolloClient, OperationVariables } from '@apollo/client';
import LayoutContext from './LayoutContext';
import Logo from './components/Logo';
import './styles.scss';
import { Module, Project } from '@repo/types';
import { get_initial_project, serverClient } from '@repo/provider';
import { Sidebar } from '@repo/ui';

export const metadata = {
	title: 'CMS Nocogirls',
	description: 'PH'
};

interface GetProjectsResponse {
	objects: {
		getProject: Project;
	};
};

const getData = async () => {
	const projectId = process.env.PROJECT_ID;
	
	const client: ApolloClient<any> = serverClient(process.env.SASHIDO_GQL_URL as string, process.env.SASHIDO_APP_ID as string, process.env.SASHIDO_MASTER_KEY as string);
	
	const { data } = await client.query<GetProjectsResponse, OperationVariables>({ query: get_initial_project, variables: { id: projectId ||'H7eK6Fv3cn' } });
	
	return data;
};

export default async function  RootLayout({
	children
}: {
	children: React.ReactNode,
}) {
	const data = await getData();
	console.log(data.objects.getProject.modules.results);
	
	return (
		<html lang="de">
			<body>
				<div className={styles.layout}>
					<div className={styles.sidebar_container}>
						<div className={styles.sidebar_header}>
							<Logo logo={data.objects.getProject.logo}  />
						</div>
						<Sidebar menuItems={data.objects.getProject.modules.results.map((module: Module) => ({
							label: module.name,
							icon: module.icon,
							value: module.path
						}))} />
					</div >
					<LayoutContext project={data.objects.getProject}>
						<div className={styles.main_content}>
							<div className={styles.content_container}>
								{/* <SiteHeader title={data.objects.getProject.name} /> */}
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