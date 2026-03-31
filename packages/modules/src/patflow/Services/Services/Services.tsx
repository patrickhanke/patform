"use client";

import { useContext, useMemo, useState } from "react";
import { Page } from "@repo/ui";
import { Services as ServicesContent, ServicesOverview } from "./content";
import { UserContext } from "@repo/provider";

const Services = () => {
	const { projectId } = useContext(UserContext);
	const [createService, setCreateService] = useState<boolean>(false);

	const pageHeaderButtons = useMemo(() => {
		return [
			{
				text: "Service erstellen",
				onClick: () => setCreateService(true)
			}
		];
	}, []);

	return (
		<Page title="Leistungen" pageHeaderButtons={pageHeaderButtons}>
			<ServicesOverview
				projectId={projectId}
				createService={createService}
				setCreateService={setCreateService}
			/>
		</Page>
	);
};

export default Services;
