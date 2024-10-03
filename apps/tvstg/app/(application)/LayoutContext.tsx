import { ApolloAppProvider, AppContextProvider } from '@repo/provider';
import { Project } from '@repo/types';



const LayoutContext = ({project, children}: {project: Project, children: React.ReactNode}) => {
	return (
		<ApolloAppProvider
			appId={process.env.SASHIDO_APP_ID as string }
			masterKey={process.env.SASHIDO_MASTER_KEY as string}
		>
			<AppContextProvider project={project}>
				{children}
			</AppContextProvider>
		</ApolloAppProvider>
	);
};

export default LayoutContext;