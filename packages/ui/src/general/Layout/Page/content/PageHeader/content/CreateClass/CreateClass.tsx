"use client";

import { useCallback, useContext, useState } from "react";
import { SlideInForm } from "@repo/ui";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import { CreateClassProps } from "./types";
import { Classes } from "@repo/types";
import { FormikValues } from "formik";

const CreateClass = <T extends Classes>({
	initialData,
	fields,
	text,
	className,
	refetch
}: CreateClassProps<T>) => {
	const { createData } = useDataHandler();
	const { currentModule, user } = useContext(PatstoreAppContext);
	const [isOpen, setIsOpen] = useState(false);

	const dataHandler = useCallback(
		async (data: FormikValues) => {
			await createData({
				className: className,
				updateObject: {
					module: {
						__type: "Pointer",
						className: "Module",
						objectId: currentModule.objectId
					},
					...data
				},
				feedback: "Neue Daten erstellt",
				userId: user?.objectId
			});
			if (refetch) {
				await refetch();
			}
		},
		[user]
	);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				disabled={false}
				className="full_button md primary"
			>
				{text}
			</button>
			<SlideInForm
				isOpen={isOpen}
				title={text}
				setIsOpen={setIsOpen}
				fields={fields}
				data={initialData}
				dataHandler={(values) => dataHandler(values)}
			/>
		</>
	);
};

export default CreateClass;
