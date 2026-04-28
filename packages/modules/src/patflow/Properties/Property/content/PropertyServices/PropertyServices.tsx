import { FC, useMemo, useState } from "react";
import { PropertyServicesProps } from "./types";
import { ServicesOverview, ServicesCalendar } from "@repo/modules";
import { SwitchButton, SwitchButtons } from "@repo/ui";
import switch_buttons from "./constants/switch_buttons";

const PropertyServices: FC<PropertyServicesProps> = ({ objectId }) => {
	const [serviceState, setServiceState] = useState<SwitchButton>(
		switch_buttons[0]
	);

	const serviceContent = useMemo(() => {
		if (serviceState.value === "overview") {
			return <ServicesOverview propertyId={objectId} />;
		}
		return <ServicesCalendar propertyId={objectId} />;
	}, [serviceState]);

	return (
		<div className="site_content">
			<SwitchButtons
				buttonStates={[...switch_buttons]}
				changeHandler={setServiceState}
				currentStates={serviceState}
			/>
			{serviceContent}
		</div>
	);
};

export default PropertyServices;
