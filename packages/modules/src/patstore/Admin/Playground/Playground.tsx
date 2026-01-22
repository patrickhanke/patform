"use client";

import { AdminPage } from "@repo/modules";
import { Coloproktologen } from "./content/Coloproktologen";
import { Koloproktologie } from "./content";
import { Cms } from "./content";

const Playground = () => {
	return (
		<AdminPage title={"Playground"} emptyContent={true}>
			{/* <Coloproktologen /> */}
			{/* <Koloproktologie /> */}
			<Koloproktologie />
		</AdminPage>
	);
};

export default Playground;
