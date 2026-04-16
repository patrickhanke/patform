"use client";

import { useContext, useMemo, useState } from "react";
import { Icon, IconButton, Page } from "@repo/ui";
import { Services as ServicesContent, ServicesOverview } from "./content";
import { useDataStore, UserContext } from "@repo/provider";
import { CreateTask } from "@repo/modules";

const Button = ({ onClick }: { onClick: () => void }) => (
	<IconButton
		onClick={() => onClick()}
		icon="plus"
		text="Leistung hinzufügen"
	/>
);

const Services = () => {
	const { projectId } = useContext(UserContext);
	const [createService, setCreateService] = useState<boolean>(false);
	

	const createServiceButton = useMemo(() => {
		return <CreateTask isService={true} button={Button} />;
	}, []);

	return (
		<Page title="Leistungen" pageHeaderContent={createServiceButton}>
			<ServicesOverview
				projectId={projectId}
				createService={createService}
				setCreateService={setCreateService}
			/>
		</Page>
	);
};

export default Services;
