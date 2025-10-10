"use client";

import { useCallback, useMemo } from "react";
import {
	CreateColumnHookProps,
	ColumnClasses,
	UpdateColumnData
} from "../types";
import { ColumnDef } from "@tanstack/react-table";
import { useDataHandler } from "@repo/provider";
import {
	ClassState,
	EventDate,
	EventTime,
	PersonClass,
	Team,
	WebpageComponents,
	WebpageContent
} from "@repo/types";
import {
	ColorValues,
	LatitudeLongitude,
	PatstoreSelectImages,
	TableColumnCategory,
	TableColumnConnectedElements,
	TableColumnEditBoolean,
	TableColumnEditColor,
	TableColumnEditState,
	TableColumnEditTeam,
	TableColumnGeopoint,
	TableColumnImage,
	TableColumnPerson,
	TableColumnPersons,
	TableColumnString,
	TableColumnTexteditor,
	TableColumnTextfield,
	TableColumnDate,
	TableColumnImages
} from "@repo/ui";
import { get } from "lodash-es";
import { IconButton } from "../../../Buttons";
import {
	TableColumnDatesField,
	TableColumnDeleteField,
	TableColumnEditContent,
	TableColumnEditDate,
	TableColumnEditField,
	TableColumnTimesField,
	TableColumnEditWebpageComponents
} from "../content";
import { TableColumnFile, TableColumnDocuments } from "../components";

const useCreateColumns = <T extends ColumnClasses>({
	data,
	categories = [],
	fields = [],
	className,
	refetch,
	constants,
	editLink,
	disableCategory
}: CreateColumnHookProps<T>) => {
	const { updateData } = useDataHandler(false);

	const updateColumnData: UpdateColumnData = useCallback(
		async ({ objectId, updateObject, feedback }) => {
			await updateData({
				className,
				objectId,
				updateObject,
				feedback
			});
			if (refetch) {
				refetch();
			}
		},
		[className, refetch]
	);

	const handleImageChange = useCallback(
		(objectId: string, columnId: string | number) =>
			(value: string | object | number) =>
				updateColumnData({
					objectId,
					updateObject: { [columnId]: value },
					feedback: "Bilder aktualisiert"
				}),
		[updateColumnData]
	);

	const columns = useMemo(() => {
		const columnArray: ColumnDef<T>[] = [];
		data.forEach((columnElement) => {
			if (
				columnElement.type === "string" ||
				columnElement.type === "edit_string"
			) {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnString
							value={row[columnElement.id] as string}
							isEditable={
								columnElement.type === "edit_string"
									? true
									: false
							}
							onChange={(value: string) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Text aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false
				} as ColumnDef<T>);
			}
			if (
				columnElement.type === "edit_image" ||
				columnElement.type === "gallery"
			) {
				columnArray.push({
					accessorFn: (row) => (
						<PatstoreSelectImages
							key={row.objectId}
							image={row[columnElement.id] as string | string[]}
							maxFileCount={
								columnElement.type === "gallery" ? 20 : 1
							}
							onChange={handleImageChange(
								row.objectId,
								columnElement.id as string
							)}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id
				} as ColumnDef<T>);
			}
			if (
				columnElement.type === "textfield" ||
				columnElement.type === "edit_textfield"
			) {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnTextfield
							value={row[columnElement.id] as string}
							isEditable={
								columnElement.type === "edit_textfield"
									? true
									: false
							}
							onChange={(value: string) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Text aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "texteditor") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnTexteditor
							value={row[columnElement.id] as string}
							isEditable={true}
							onChange={(value: string) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Text aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_dates") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnDatesField
							initialDates={row[columnElement.id] as EventDate[]}
							onChange={(value: EventDate[]) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Termin aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id
				} as ColumnDef<T>);
			}
			if (
				columnElement.type === "date" ||
				columnElement.type === "date_picker"
			) {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnDate
							date={row[columnElement.id] as string}
							onChange={(value: string) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Datum aktualisiert"
								})
							}
							isEditable={
								columnElement.type === "date_picker"
									? true
									: false
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false
				} as ColumnDef<T>);
			}
			if (
				columnElement.type === "geopoint" ||
				columnElement.type === "edit_geopoint"
			) {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnGeopoint
							value={row[columnElement.id] as LatitudeLongitude}
							isEditable={
								columnElement.type === "edit_geopoint"
									? true
									: false
							}
							onChange={(value: LatitudeLongitude) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: {
										[columnElement.id]: {
											__type: "GeoPoint",
											latitude: value.latitude,
											longitude: value.longitude
										}
									},
									feedback: "GeoPoint aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (
				columnElement.type === "state" ||
				columnElement.type === "edit_state"
			) {
				columnArray.push({
					accessorFn: (row) =>
						get(constants, columnElement.id, undefined) ? (
							<TableColumnEditState
								value={row[columnElement.id] as string}
								isEditable={
									columnElement.disabled
										? columnElement.disabled(row)
										: true
								}
								options={get(constants, columnElement.id, [])}
								onChange={(value: ClassState) =>
									updateColumnData({
										objectId: row.objectId,
										updateObject: {
											[columnElement.id]: value.value
										},
										feedback: "Status aktualisiert"
									})
								}
							/>
						) : (
							<p className="error_message">
								Keinen korrekten Status übergeben
							</p>
						),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "image") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnImage
							file={row[columnElement.id] as string | File}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (
				columnElement.type === "person" ||
				columnElement.type === "edit_person"
			) {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnPerson
							isEditable={
								columnElement.type === "edit_person"
									? true
									: false
							}
							value={row[columnElement.id] as PersonClass}
							onChange={(value: string) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: {
										[columnElement.id]: {
											__type: "Pointer",
											className: "Person",
											objectId: value
										}
									},
									feedback: "Person aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_persons") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnPersons
							isEditable={
								columnElement.type === "edit_person" ||
								columnElement.type === "edit_persons"
									? true
									: false
							}
							value={
								(row[columnElement.id] as string[]) ||
								([] as string[])
							}
							onChange={(values: string[]) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: {
										[columnElement.id]: values
									},
									feedback: "Personen aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_times") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnTimesField
							initialTimes={row[columnElement.id] as EventTime[]}
							onChange={(value: EventTime[]) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Zeiten aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_color") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditColor
							value={row[columnElement.id] as ColorValues}
							onChange={(value: string) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Farbe geändert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_team") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditTeam
							initialData={row[columnElement.id] as Team}
							onChange={(value: Team) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Team aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "file") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnFile
							classKey={"file"}
							className={className as "Download" | "Image"}
							id={row.objectId}
							onChange={() => refetch()}
							maxFileCount={1}
							value={row["file"]}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "files") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnDocuments
							value={row[columnElement.id] || ([] as string[])}
							onChange={(value: string[]) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Dokumente aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_date") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditDate
							value={row[columnElement.id] as EventDate}
							onChange={(value: EventDate) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: {
										[columnElement.id]: value
									},
									feedback: "Datum aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "boolean") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditBoolean
							value={row[columnElement.id] as boolean}
							onChange={(value: boolean) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: {
										[columnElement.id]: value
									},
									feedback: "Wert aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "content") {
				columnArray.push({
					accessorFn: (row) =>
						row?.type === "text" ? (
							<TableColumnTexteditor
								value={row[columnElement.id]?.value as string}
								isEditable={true}
								onChange={(value: string) =>
									updateColumnData({
										objectId: row.objectId,
										updateObject: {
											[columnElement.id]: {
												type: row.type,
												value
											}
										},
										feedback: "Text aktualisiert"
									})
								}
							/>
						) : (
							<TableColumnImages
								value={
									row[columnElement.id] as string | string[]
								}
								maxFileCount={
									columnElement.type === "gallery" ? 20 : 1
								}
								onChange={(value: string | string[]) =>
									updateColumnData({
										objectId: row.objectId,
										updateObject: {
											[columnElement.id]: {
												type: row.type,
												value: value
											}
										},
										feedback: "Bilder aktualisiert"
									})
								}
							/>
						),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_content") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditContent
							initialData={
								row[columnElement.id] as WebpageContent[]
							}
							onChange={(value: WebpageContent[]) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Inhalt aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_webpage_components") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditWebpageComponents
							type={row.type}
							initialData={
								row[columnElement.id] as WebpageComponents
							}
							onChange={(value: WebpageContent[]) =>
								updateColumnData({
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Inhalt aktualisiert"
								})
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}

			if (columnElement.type === "connected_elements") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnConnectedElements
							value={row[columnElement.id] as Array<object>}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
		});

		categories.map((category) => {
			columnArray.push({
				accessorFn: (row) => (
					<TableColumnCategory
						category={category}
						isEditable={
							disableCategory
								? !disableCategory(row, category.label)
								: true
						}
						categories={row.categories || []}
						onChange={(categories: string[]) =>
							updateColumnData({
								objectId: row.objectId,
								updateObject: { categories },
								feedback: "Kategorie aktualisiert"
							})
						}
					/>
				),
				header: () => <span>{category.label}</span>,
				id: category.id,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false,
				sortingFn: undefined // Default sortingFn
			} as ColumnDef<T>);
		});

		if (typeof editLink === "string") {
			columnArray.push({
				accessorFn: (row) => (
					<div className="button_container">
						<IconButton
							isLink
							link={`/${editLink}/${row.objectId}`}
							icon="link"
						/>
						<TableColumnDeleteField
							objectId={row.objectId}
							className={className}
							refetch={refetch}
						/>
					</div>
				),
				header: () => <span>Bearbeiten</span>,
				id: "edit",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false,
				sortingFn: undefined // Default sortingFn
			});
		} else
			columnArray.push({
				accessorFn: (row) => (
					<div className="button_container">
						{fields.length > 0 && (
							<TableColumnEditField
								objectId={row.objectId}
								className={className}
							/>
						)}
						<TableColumnDeleteField
							objectId={row.objectId}
							className={className}
							refetch={refetch}
						/>
					</div>
				),
				header: () => (
					<span>{fields.length > 0 ? "Bearb." : "Löschen"}</span>
				),
				id: "edit",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false,
				sortingFn: undefined
			});

		return columnArray;
	}, [
		data,
		className,
		refetch,
		constants,
		fields,
		categories,
		editLink,
		disableCategory,
		updateColumnData,
		handleImageChange
	]);

	return columns;
};

export default useCreateColumns;
