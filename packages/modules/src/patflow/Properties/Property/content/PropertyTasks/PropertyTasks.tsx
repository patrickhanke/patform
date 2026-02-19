import { Tasks } from "@repo/modules";
import { Suspense } from "react";

const PropertyTasks = ({ objectId }: { objectId: string }) => {
	return (
		<Suspense>
			<Tasks
				key="active"
				pageState="active"
				id={objectId}
				className={"Property"}
			/>
		</Suspense>
	);
};

export default PropertyTasks;
