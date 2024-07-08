import React from 'react';
import '@repo/styles/global';
import '@repo/styles/typography';
import '@repo/styles/buttons';
import styles from './Layout.module.scss';
import { serverClient } from '@repo/provider';
import { gql, ApolloClient, OperationVariables } from '@apollo/client';
import LayoutContext from './LayoutContext';
import Logo from './components/Logo';
import './styles.scss';
import Sidebar from './content/Sidebar';
import { cookies } from 'next/headers';
import SiteHeader from './content/SiteHeader';
import { Project } from '@repo/types';

export const metadata = {
	title: 'CMS Nocogirls',
	description: 'PH'
};

interface GetProjectsResponse {
	objects: {
		getProject: Project;
		
	};
};

const query = gql` 
    query getProjects($id: ID!) {
    	objects {
			getProject(objectId: $id) {
				name
				objectId
				content
				logo {
					name
					url
				}
			}
		}
	}
`;

const getData = async () => {
	const projectId = cookies().get('cms_project')?.value || 'H7eK6Fv3cn';
	console.log('projectId', projectId);
	
	const client: ApolloClient<any> = serverClient(process.env.SASHIDO_API_URL as string, process.env.SASHIDO_APP_ID as string, process.env.SASHIDO_MASTER_KEY as string);
	
	const { data } = await client.query<GetProjectsResponse, OperationVariables>({ query, variables: { id: projectId ||'H7eK6Fv3cn' } });
  
	return data;
};

export default async function  RootLayout({
	children
}: {
	children: React.ReactNode,
}) {
	const data = await getData();
	
	return (
		<html lang="de">
			<body>
				<div className={styles.layout}>
					<div className={styles.sidebar_container}>
						<div className={styles.sidebar_header}>
							<Logo logo={data.objects.getProject.logo}  />
						</div>
						<Sidebar menuItems={data.objects.getProject.content} />
					</div >
					<LayoutContext project={data.objects.getProject}>
						<div className={styles.main_content}>
							<div className={styles.content_container}>
								<SiteHeader title={data.objects.getProject.name} />
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