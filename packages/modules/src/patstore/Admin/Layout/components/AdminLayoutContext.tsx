"use client";

import { ApolloAppProvider } from "@repo/provider";
import { PatstoreProject } from "@repo/types";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { chakraConfig } from "@repo/provider";

const AdminLayoutContext = ({
	children
}: {
	projects: PatstoreProject[];
	children: React.ReactNode;
}) => {
	return (
		<ApolloAppProvider
			uri={process.env.SASHIDO_GQL_URL as string}
			restKey={process.env.SASHIDO_REST_KEY as string}
			appId={process.env.SASHIDO_APP_ID as string}
			masterKey={process.env.SASHIDO_MASTER_KEY as string}
		>
			<ChakraProvider value={createSystem(defaultConfig, chakraConfig)}>
				{children}
			</ChakraProvider>
		</ApolloAppProvider>
	);
};

export default AdminLayoutContext;
