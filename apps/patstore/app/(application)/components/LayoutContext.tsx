'use client';

import { ApolloAppProvider, AppContextProvider, ProjectContext } from '@repo/provider';
import { Project } from '@repo/types';
import {ProjectContextProvider} from '@repo/provider';

const LayoutContext = ({projects, children}: {projects: string[], children: React.ReactNode}) => {
	console.log({projects});
	
	
	return (
		<ApolloAppProvider
			appId={process.env.SASHIDO_APP_ID as string }
			masterKey={process.env.SASHIDO_MASTER_KEY as string}
		>
			<ProjectContextProvider projects={projects}>
				<ProjectContext.Consumer>
					{({project}) => {
						console.log(project);
						
						if (!project || !project.objectId) {
							return null;
						}
						return (
							<AppContextProvider project={project}>
								{children}
							</AppContextProvider>
						);
					}}
				</ProjectContext.Consumer>
				
			</ProjectContextProvider>
		</ApolloAppProvider>
	);
};

export default LayoutContext;