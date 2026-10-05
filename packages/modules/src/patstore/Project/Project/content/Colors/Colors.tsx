"use client";

import { PatstoreProjectColor } from "@repo/types";
import {
	CreateButton,
	Divider,
	IconButton,
	SlideInForm,
	usePageData
} from "@repo/ui";
import { FormikValues } from "formik";
import { FC, useMemo, useState } from "react";
import fields from "./constants/fields";
import createColorId from "./functions/createColorId";
import { ColorsProps } from "./types";

const DEFAULT_COLOR = "rgba(0, 0, 0, 1)";

const Colors: FC<ColorsProps> = ({ project }) => {
	const { data, setData } = usePageData(
		{
			initialData: { settings: project.settings },
			objectId: project.objectId
		},
		{
			className: "Project",
			updateObject: (values) => values,
			message: "Farben wurden erfolgreich aktualisiert."
		}
	);
	const [isOpen, setIsOpen] = useState(false);
	const [editedColorId, setEditedColorId] = useState<string | null>(null);

	const colors = useMemo(
		() => data?.settings?.colors || [],
		[data?.settings?.colors]
	);

	const editedColor = useMemo(
		() => colors.find((color) => color.id === editedColorId),
		[colors, editedColorId]
	);

	const closeSlideIn = () => {
		setIsOpen(false);
		setEditedColorId(null);
	};

	const saveColor = (values: FormikValues) => {
		const color: PatstoreProjectColor = {
			id:
				editedColorId ??
				createColorId(colors.map((existing) => existing.id)),
			label: values.label || "",
			value: values.value || DEFAULT_COLOR
		};

		setData(
			"settings.colors",
			editedColorId
				? colors.map((existing) =>
						existing.id === editedColorId ? color : existing
					)
				: [...colors, color]
		);
		closeSlideIn();
	};

	return (
		<div className="vertical_container">
			{colors.length === 0 && (
				<p>Es wurden noch keine Farben angelegt.</p>
			)}
			{colors.map((color) => (
				<div key={color.id}>
					<div className="flex row a-ce j-sb gap-sm">
						<div className="flex row a-ce gap-sm">
							<span
								style={{
									width: 32,
									height: 32,
									borderRadius: 4,
									border: "1px solid rgba(0, 0, 0, 0.1)",
									backgroundColor: color.value
								}}
							/>
							<div>
								<p>{color.label}</p>
							</div>
						</div>
						<div className="flex row a-ce gap-sm">
							<IconButton
								icon="edit"
								tooltip="Farbe bearbeiten"
								onClick={() => {
									setEditedColorId(color.id);
									setIsOpen(true);
								}}
							/>
							<IconButton
								icon="delete"
								tooltip="Farbe löschen"
								onClick={() =>
									setData(
										"settings.colors",
										colors.filter(
											(existing) =>
												existing.id !== color.id
										)
									)
								}
							/>
						</div>
					</div>
					<Divider size="small" />
				</div>
			))}
			<CreateButton
				text="Farbe hinzufügen"
				size="small"
				onClick={() => {
					setEditedColorId(null);
					setIsOpen(true);
				}}
			/>
			<SlideInForm
				title={editedColor ? "Farbe bearbeiten" : "Farbe hinzufügen"}
				isOpen={isOpen}
				setIsOpen={() => closeSlideIn()}
				fields={fields}
				data={{
					label: editedColor?.label || "",
					value: editedColor?.value || DEFAULT_COLOR
				}}
				dataHandler={saveColor}
			/>
		</div>
	);
};

export default Colors;
