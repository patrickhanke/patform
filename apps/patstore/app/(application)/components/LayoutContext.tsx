'use client';

import { ApolloAppProvider, AppContextProvider, DataContextProvider, ProjectContext } from '@repo/provider';
import {ProjectContextProvider} from '@repo/provider';
import { PatstoreUser } from '@repo/types';

const LayoutContext = ({user, children}: {user: PatstoreUser, children: React.ReactNode}) => {
	
	return (
		<ApolloAppProvider
			appId={process.env.SASHIDO_APP_ID as string }
			masterKey={process.env.SASHIDO_MASTER_KEY as string}
		>
			<ProjectContextProvider projects={user.projects}>
				<ProjectContext.Consumer>
					{({project}) => {
						if (!project || !project.objectId) {
							return null;
						}
						return (
							<AppContextProvider project={project}>
								<DataContextProvider>
									{children}
								</DataContextProvider>
							</AppContextProvider>
						);
					}}
				</ProjectContext.Consumer>
			</ProjectContextProvider>
		</ApolloAppProvider>
	);
};

export default LayoutContext;