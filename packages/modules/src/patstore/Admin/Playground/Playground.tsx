"use client";

import { AdminPage } from "@repo/modules";
import { Coloproktologen } from "./content/Coloproktologen";

const Playground = () => {
	return (
		<AdminPage title={"Playground"} emptyContent={true}>
			<Coloproktologen />
		</AdminPage>
	);
};

export default Playground;
