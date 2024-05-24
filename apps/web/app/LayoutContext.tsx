import { ApolloAppProvider } from '@repo/provider';
import React from 'react';

const LayoutContext = ({children}: {children: React.ReactNode}) => {
	return (
		<ApolloAppProvider
			appId={process.env.SASHIDO_APP_ID }
			masterKey={process.env.SASHIDO_MASTER_KEY}
		
		>
			{children}
		</ApolloAppProvider>
	);
};

export default LayoutContext;