import { FC, useContext, useEffect, useState } from "react";
import { Select, SlideIn, TextInput } from "@repo/ui";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import { ErrorMessage } from "@repo/types";
import { CreateContentProps } from "../types";
import content_types from "../constant/content_types";

const CreateContent: FC<CreateContentProps> = ({
	createContent,
	setCreateContent,
	allContent,
	refetch
}) => {
	const { currentModule, user } = useContext(PatstoreAppContext);

	const { createData } = useDataHandler();
	const [content, setContent] = useState({
		name: "",
		content_id: "",
		type: ""
	});

	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const errorArray = [];
		if (!content.name) {
			errorArray.push({
				id: "name",
				key: "name",
				message: "Name ist erforderlich"
			});
		}
		if (!content.content_id) {
			errorArray.push({
				id: "id",
				key: "id",
				message: "ID ist erforderlich"
			});
		}
		if (!content.type) {
			errorArray.push({
				id: "type",
				key: "type",
				message: "Typ ist erforderlich"
			});
		}
		if (allContent.some((item) => item.content_id === content.content_id)) {
			errorArray.push({
				id: "content_id",
				key: "content_id",
				message: "ID ist bereits vergeben"
			});
		}
		setErrors(errorArray);
	}, [content, allContent]);

	const reset = () => {
		setContent({
			name: "",
			content_id: "",
			type: ""
		});
		setErrors([]);
		setLoading(false);
		setCreateContent(false);
	};

	return (
		<SlideIn
			header="Neues Inhaltselement erstellen"
			isOpen={createContent}
			cancel={() => reset()}
			errors={errors}
			disabled={[false, errors.length > 0 || loading]}
			confirm={async () => {
				setLoading(true);
				await createData({
					className: "Content",
					updateObject: {
						name: content.name,
						content_id: content.content_id,
						type: content.type,
						active: false,
						module: {
							__type: "Pointer",
							className: "Module",
							objectId: currentModule.objectId
						},
						data: {},
						categories: [],
						created_by: {
							__type: "Pointer",
							className: "_User",
							objectId: user?.objectId
						}
					}
				});
				await refetch();
				reset();
			}}
		>
			<div>
				<TextInput
					label="Name"
					onChange={(value) => {
						setContent((prev) => ({
							...prev,
							name: value
						}));
					}}
					id="name"
				/>
				<TextInput
					label="ID"
					onChange={(value) => {
						setContent((prev) => ({
							...prev,
							content_id: value
						}));
					}}
					id="content_id"
				/>
				<Select
					label="Type"
					options={content_types}
					value={content.type}
					onChange={(value) => {
						setContent((prev) => ({
							...prev,
							type: value.value
						}));
					}}
				/>
			</div>
		</SlideIn>
	);
};

export default CreateContent;
