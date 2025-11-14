import { useCallback, useContext, useMemo, useState } from "react";
import { Field, SlideInForm } from "@repo/ui";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import { CreateCategoryProps } from "../types";
import { FormikValues } from "formik";

const CreateCategory = ({
	refetch,
	typeId,
	typeLabel,
	type
}: CreateCategoryProps) => {
	const { createData } = useDataHandler();
	const { currentModule, user } = useContext(PatstoreAppContext);
	const [isOpen, setIsOpen] = useState(false);

	const categoryFields = useMemo(() => {
		const constantFields: Field[] = [
			{
				id: "title",
				position: 1,
				name: "title",
				type: "input",
				label: "Name",
				validation: {
					validate: true,
					required: "Pflichtfeld",
					min_length: 2
				}
			},
			{
				id: "description",
				position: 2,
				name: "description",
				type: "textarea",
				label: "Beschreibung"
			},
			{
				id: "image",
				position: 3,
				name: "image",
				type: "image_select",
				label: "Bild",
				options: {
					max_file_count: 1,
					return_type: "string"
				}
			}
		];
		return constantFields;
	}, []);

	const handleSubmit = useCallback(
		async (data: FormikValues) => {
			await createData({
				className: "Category",
				updateObject: {
					...data,
					type: type ? type : "default",
					category_id: typeId,
					module: {
						__type: "Pointer",
						className: "Module",
						objectId: currentModule.objectId
					}
				},
				userId: user?.objectId
			});
			refetch();
			setIsOpen(false);
		},
		[createData, user, refetch, typeId]
	);

	return (
		<div>
			<button
				className="full_button primary md"
				onClick={() => setIsOpen(true)}
			>{`Eintrag zu ${typeLabel} hinzufügen`}</button>
			<SlideInForm
				isOpen={isOpen}
				setIsOpen={() => setIsOpen(false)}
				fields={categoryFields}
				// data={}
				dataHandler={(values) => handleSubmit(values)}
				title="Eintrag hinzufügen"
			/>
		</div>
	);
};

export default CreateCategory;
