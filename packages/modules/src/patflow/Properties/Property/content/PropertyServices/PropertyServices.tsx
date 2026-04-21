import { FC } from "react";
import { PropertyServicesProps } from "./types";
import { ServicesOverview } from "@repo/modules";

const PropertyServices: FC<PropertyServicesProps> = ({ objectId }) => {
	return (
		<div className="site_content">
			<ServicesOverview propertyId={objectId} />
		</div>
	);
};

export default PropertyServices;
