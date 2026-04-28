import { useMemo } from "react";
import { EventCalendar } from "@repo/ui";
import { createEventFromTask, useDataStore } from "@repo/provider";

const ServicesCalendar = ({ propertyId }: { propertyId: string }) => {
	const { services } = useDataStore();

	console.log({ services });

	const calendarData = useMemo(() => {
		return createEventFromTask(
			services.filter((service) => {
				return service.property?.objectId === propertyId;
			})
		);
	}, [services, propertyId]);

	console.log({ calendarData });

	return (
		<div>
			<EventCalendar dates={calendarData} />
		</div>
	);
};

export default ServicesCalendar;
