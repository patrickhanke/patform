import { useDataStore } from "@repo/provider";
import { Icon } from "@repo/ui";

const ServiceProperty = ({ serviceProperty }: { serviceProperty: string }) => {
	const { properties } = useDataStore();
	const property = properties.find(
		(property) => property.objectId === serviceProperty
	);
	return (
		<div>
			<div className="flex row">
				<Icon type="house" size={12} />
				<span style={{ whiteSpace: "nowrap" }}>{property?.name}</span>
			</div>
		</div>
	);
};

export default ServiceProperty;
