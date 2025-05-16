"use client";

import { useMemo } from "react";
import { CreateColumnHookProps, ColumnClasses } from "../types";
import { ColumnDef } from "@tanstack/react-table";
import TableColumnString from "../components/TableColumnString";
import { useDataHandler } from "@repo/provider";
import TableColumnImage from "../components/TableColumnImage";
import TableColumnTextfield from "../components/TableColumnTextfield";
import TableColumnCategory from "../components/TableColumnCategory";
import TableColumnEditField from "../content/TableColumnEditField";
import TableColumnDeleteField from "../content/TableColumnDeleteField/TableColumnDeleteField";
import TableColumnDatesField from "../content/TableColumnDatesField";
import {
	ClassState,
	EventDate,
	EventTime,
	PersonClass,
	Team,
	WebpageContent
} from "@repo/types";
import TableColumnDate from "../components/TableColumnDate";
import TableColumnTexteditor from "../components/TableColumnTexteditor";
import TableColumnGeopoint from "../components/TableColumnGeopoint";
import { ColorValues, LatitudeLongitude, PatstoreSelectImages } from "@repo/ui";
import TableColumnEditState from "../components/TableColumnEditState";
import { get } from "lodash-es";
import TableColumnPerson from "../components/TableColumnPerson";
import TableColumnTimesField from "../content/TableColumnTimesField";
import TableColumnPersons from "../components/TableColumnPersons";
import TableColumnFiles from "../components/TableColumnFiles";
import { IconButton } from "../../../Buttons";
import { TableColumnEditTeam } from "../content/TableColumnEditTeam";
import TableColumnEditColor from "../components/TableColumnEditColor";
import TableColumnEditDate from "../content/TableColumnEditDate";
import TableColumnEditContent from "../content/TableColumnEditContent";
import TableColumnEditBoolean from "../components/TableColumnEditBoolean";
import TableColumnImages from "../components/TableColumnImages";
import TableColumnConnectedElements from "../components/TableColumnConnectedElements";

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
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Text aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
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
							onChange={async (value: string | string[]) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Bilder aktualisiert"
								});

								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
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
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Text aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}
			if (columnElement.type === "texteditor") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnTexteditor
							value={row[columnElement.id] as string}
							isEditable={true}
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Text aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_dates") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnDatesField
							initialDates={row[columnElement.id] as EventDate[]}
							onChange={async (value: EventDate[]) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Termin aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
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
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Datum aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
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
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
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
							onChange={async (value: LatitudeLongitude) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {
										[columnElement.id]: {
											__type: "GeoPoint",
											latitude: value.latitude,
											longitude: value.longitude
										}
									},
									feedback: "GeoPoint aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
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
								onChange={async (value: ClassState) => {
									await updateData({
										className: className,
										objectId: row.objectId,
										updateObject: {
											[columnElement.id]: value.value
										},
										feedback: "Status aktualisiert"
									});
									if (refetch) {
										refetch();
									}
								}}
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
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}
			if (columnElement.type === "image") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnImage
							url={row[columnElement.id] as string}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
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
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {
										[columnElement.id]: {
											__type: "Pointer",
											className: "Person",
											objectId: value
										}
									},
									feedback: "Person aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
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
							onChange={async (values: string[]) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {
										[columnElement.id]: values
									},
									feedback: "Personen aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_times") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnTimesField
							initialTimes={row[columnElement.id] as EventTime[]}
							onChange={async (value: EventTime[]) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Zeiten aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_color") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditColor
							value={row[columnElement.id] as ColorValues}
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Farbe geändert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_team") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditTeam
							initialData={row[columnElement.id] as Team}
							onChange={async (value: Team) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Team aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}
			if (
				columnElement.type === "file" ||
				columnElement.type === "files"
			) {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnFiles
							url={row[columnElement.id] as string}
							onChange={async (value: string | string[]) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Datei aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
							maxFileCount={
								columnElement.type === "file" ? 1 : 10
							}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_date") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditDate
							value={row[columnElement.id] as EventDate}
							onChange={async (value: EventDate) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {
										[columnElement.id]: value
									},
									feedback: "Datum aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}

			if (columnElement.type === "boolean") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditBoolean
							value={row[columnElement.id] as boolean}
							onChange={async (value: boolean) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {
										[columnElement.id]: value
									},
									feedback: "Wert aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}
			if (columnElement.type === "content") {
				columnArray.push({
					accessorFn: (row) =>
						row?.type === "text" ? (
							<TableColumnTexteditor
								value={row[columnElement.id]?.value as string}
								isEditable={true}
								onChange={async (value: string) => {
									await updateData({
										className: className,
										objectId: row.objectId,
										updateObject: {
											[columnElement.id]: {
												type: row.type,
												value
											}
										},
										feedback: "Text aktualisiert"
									});
									if (refetch) {
										refetch();
									}
								}}
							/>
						) : (
							<TableColumnImages
								value={
									row[columnElement.id] as string | string[]
								}
								maxFileCount={
									columnElement.type === "gallery" ? 20 : 1
								}
								onChange={async (value: string | string[]) => {
									await updateData({
										className: className,
										objectId: row.objectId,
										updateObject: {
											[columnElement.id]: {
												type: row.type,
												value: value
											}
										},
										feedback: "Bilder aktualisiert"
									});
									if (refetch) {
										refetch();
									}
								}}
							/>
						),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}

			if (
				columnElement.type === "updated_by" ||
				columnElement.type === "created_by"
			) {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnPerson
							value={row[columnElement.id] as PersonClass}
							isEditable={false}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
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
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_content") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnEditContent
							initialData={
								row[columnElement.id] as WebpageContent[]
							}
							onChange={async (value: WebpageContent[]) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: { [columnElement.id]: value },
									feedback: "Inhalt aktualisiert"
								});
								if (refetch) {
									refetch();
								}
							}}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn
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
						onChange={async (categories: string[]) => {
							await updateData({
								objectId: row.objectId,
								className,
								updateObject: {
									categories: categories
								},
								feedback: "Kategorie aktualisiert"
							});
							if (refetch) {
								refetch();
							}
						}}
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
	}, [data, className]);

	return columns;
};

export default useCreateColumns;
