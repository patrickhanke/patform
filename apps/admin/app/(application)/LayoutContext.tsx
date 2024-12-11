import { ApolloAppProvider } from '@repo/provider';
import { Project } from '@repo/types';
import { AppContextProvider } from './provider';

const LayoutContext = ({projects, children}: {projects: Project[], children: React.ReactNode}) => {
	return (
		<ApolloAppProvider
			appId={process.env.SASHIDO_APP_ID as string }
			masterKey={process.env.SASHIDO_MASTER_KEY as string}
		>
			<AppContextProvider projects={projects}>
				{children}
			</AppContextProvider>
		</ApolloAppProvider>
	);
};

export default LayoutContext;