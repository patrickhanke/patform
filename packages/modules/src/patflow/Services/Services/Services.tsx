"use client";

import { useMemo } from "react";
import { IconButton, Page } from "@repo/ui";
import { ServicesOverview } from "./content";
import { CreateTask } from "@repo/modules";

const Button = ({ onClick }: { onClick: () => void }) => (
	<IconButton
		onClick={() => onClick()}
		icon="plus"
		text="Leistung hinzufügen"
	/>
);

const Services = () => {
	const createServiceButton = useMemo(() => {
		return <CreateTask isService={true} button={Button} />;
	}, []);

	return (
		<Page title="Leistungen" pageHeaderContent={createServiceButton}>
			<ServicesOverview />
		</Page>
	);
};

export default Services;
