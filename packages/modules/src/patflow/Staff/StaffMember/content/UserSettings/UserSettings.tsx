import { getIsoFromDate } from "@repo/provider";
import { useGetData } from "@repo/provider";
import { fieldsType } from "@repo/types";
import { Form, Loader } from "@repo/ui";
import React, { useMemo } from "react";

const UserSettings = ({ userId }: { userId: string }) => {
	const { data, refetch } = useGetData({
		objectName: "User",
		fields: ["objectId", "settings"],
		id: userId
	});

	const renderFields = useMemo(() => {
		let selectFields = [] as fieldsType;
		if (data) {
			const settings = data.settings;
			selectFields = [
				{
					label: "Mitarbeiter seit",
					name: "start_date",
					type: "date",
					value: settings?.start_date || getIsoFromDate(new Date()),
					dataType: "date"
				},
				{
					label: "Urlaubstage pro Jahr",
					name: "vacation_days",
					type: "number",
					value: settings?.vacation_days || 27,
					dataType: "number",
					placeholder: "27"
				},
				{
					label: "Farbe",
					name: "color",
					type: "color",
					value: settings?.color || "#d2383e",
					dataType: "string",
					placeholder: "#d2383e"
				}
			] as fieldsType;
		}
		return selectFields;
	}, [data]);

	if (renderFields.length === 0)
		return <Loader width={"100%"} height="30px" />;

	return (
		<div className="site_content">
			<Form
				fields={renderFields}
				apiClass="User"
				id={userId}
				entry="settings"
				afterSaveFunction={() => refetch()}
				labelBefore
			/>
		</div>
	);
};

export default UserSettings;
