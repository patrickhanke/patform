import { ApolloAppProvider } from '@repo/provider';
import React from 'react';

const LayoutContext = ({children}: {children: React.ReactNode}) => {
	return (
		<ApolloAppProvider
			appId={process.env.SASHIDO_APP_ID as string }
			masterKey={process.env.SASHIDO_MASTER_KEY as string}
		
		>
			{children}
		</ApolloAppProvider>
	);
};

export default LayoutContext;