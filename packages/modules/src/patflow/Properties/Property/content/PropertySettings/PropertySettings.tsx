import React, { FC, useCallback, useMemo } from "react";
import { fieldsType } from "@repo/types";
import { Form, Loader } from "@repo/ui";
import { useDataHandler, useGetData } from "@repo/provider";
import { PropertySettingsProps } from "./types";
import ArchiveProperty from "./components/ArchiveProperty";

const PropertySettings: FC<PropertySettingsProps> = ({
	propertyId,
	refetch
}) => {
	const { updateData } = useDataHandler();
	const { data: property, refetch: settingsRefetch } = useGetData({
		objectName: "Property",
		fields: ["objectId", "name", "settings", "archived"],
		id: propertyId
	});

	const renderFields = useMemo(() => {
		let selectFields = [] as fieldsType;
		if (property) {
			const settings = property.settings;
			selectFields = [
				{
					label: "Schlüsselnummer",
					name: "key_number",
					type: "number",
					value: settings.key_number || "",
					dataType: "number"
				},
				{
					label: "Informationen",
					name: "info",
					type: "textarea",
					value: settings.info || "",
					dataType: "string"
				}
			] as fieldsType;
		}
		return selectFields;
	}, [property]);

	if (renderFields.length === 0)
		return <Loader width={"100%"} height="30px" />;

	return (
		<div className="flex col a-st gap-md">
			<Form
				fields={renderFields}
				formSubmitHandler={async (data) => {
					await updateData({
						className: "Property",
						objectId: propertyId,
						updateObject: {
							settings: data
						}
					});
					settingsRefetch();
				}}
				isHorizontal
				useWithDebounce
			/>

			<ArchiveProperty
				propertyId={propertyId}
				refetch={refetch}
				isArchived={property.archived}
			/>
		</div>
	);
};

export default PropertySettings;
