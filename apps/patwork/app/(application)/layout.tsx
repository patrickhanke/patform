import React from 'react';
import '@repo/styles/global';
import '@repo/styles/layout';
import { ApolloClient, OperationVariables } from '@apollo/client';
import { Module, Project } from '@repo/types';
import {get_initial_project, serverClient} from '@repo/provider';
import { SiteHeader } from '@repo/ui';
import LayoutContext from './components/LayoutContext';
import RenderSidebar from './components/RenderSidebar';

export const metadata = {
	title: 'Patwork Admin',
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
	
	return (
		<html lang="de">
			<body>
				<div className={'layout'}>
					<LayoutContext project={data.objects.getProject}>
						<RenderSidebar 
							logo={data.objects.getProject.logo}
							menuItems={data.objects.getProject.modules.results.map((module: Module) => ({
								label: module.name,
								icon: module.icon,
								value: module.path
							}))} 
						/>

						<div className={'main_content'} id='main_content'>
							<div className={'content_container'} id='page_content'>
								<SiteHeader />
								<div className={'content'} id='content'>
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