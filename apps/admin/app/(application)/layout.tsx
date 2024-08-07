import React from 'react';
import '@repo/styles/global';
import '@repo/styles/typography';
import '@repo/styles/buttons';
import styles from './Layout.module.scss';
import { gql, ApolloClient, OperationVariables } from '@apollo/client';
import LayoutContext from './LayoutContext';
import Logo from './components/Logo';
import './styles.scss';
import Sidebar from './content/Sidebar';
import { Project } from '@repo/types';
import { HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

export const metadata = {
	title: 'CMS Nocogirls',
	description: 'PH'
};

interface GetProjectsResponse {
	objects: {
		findProject: {
			results: Project[]
		} 
	};
};

const serverClient = (appUrl: string, appId: string, masterKey: string) => {
  
	const { getClient } = registerApolloClient(() => {
        
		return new ApolloClient({
			cache: new InMemoryCache(),
			link: new HttpLink({
				uri: 'https://pg-app-uefbsna5l6ijyse42wipewpjwu804d.scalabl.cloud/graphql/',
				headers: {
					'X-Parse-Application-Id': appId || '',
					// 'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY || '',
					'X-Parse-Master-Key':  masterKey || ''
					// 'X-Parse-Session-Token': token
				}
			})
		});
	});

	return getClient();

};

const query = gql` 
    query getProjects {
    	objects {
			findProject {
				results {
					name
					objectId
					content
					logo {
						name
						url
					}
					modules {
						results {
							objectId
							name
							path
							icon
							settings
							fields
							categories
							connected_class
						}
					}
				}
			}
		}
	}
`;

const getData = async () => {
	
	const client: ApolloClient<any> = serverClient(process.env.SASHIDO_API_URL as string, process.env.SASHIDO_APP_ID as string, process.env.SASHIDO_MASTER_KEY as string);
	
	const { data } = await client.query<GetProjectsResponse, OperationVariables>({ query});
  
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
							<p> Patform </p>
						</div>
						<Sidebar menuItems={data.objects.findProject.results.map((project: Project) => ({
							label: project.name,
							image: project.logo ? <Logo logo={project.logo} /> : null,
							value: `/project/${project.objectId}`
						}) )}
						/>
					</div >
					<LayoutContext projects={data.objects.findProject.results}>
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