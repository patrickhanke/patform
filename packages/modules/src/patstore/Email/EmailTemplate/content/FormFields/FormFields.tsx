import { FC } from "react";
import { useGetData } from "@repo/provider";
import { DnDDisplay } from "@repo/ui";
import { FormFieldsProps } from "./types";
import CreateField from "./content/CreateField/CreateField";
import FormField from "./content/FormField";

const FormFields: FC<FormFieldsProps> = ({
	formId,
	createField,
	setCreateField
}) => {
	const { data, refetch } = useGetData({
		objectName: "Form",
		fields: ["objectId", "createdAt", "fields", "settings"],
		id: formId
	});

	if (!data) {
		return null;
	}

	if (data.settings?.static_form === true) {
		return (
			<p>
				Bei einem statischen Formular können keine Felder angelegt oder
				verändert werden.
			</p>
		);
	}

	return (
		<div>
			<DnDDisplay
				items={data?.fields || []}
				ItemComponent={({ item }) => (
					<FormField
						formId={formId}
						field={item}
						refetch={refetch}
						fields={data?.fields || []}
					/>
				)}
				objectClass="Form"
				subField={{
					id: formId,
					field: "fields"
				}}
				refetch={refetch}
			/>
			<CreateField
				createField={createField}
				fields={data?.fields || []}
				setCreateField={setCreateField}
				formId={formId}
				refetch={refetch}
			/>
		</div>
	);
};

export default FormFields;
