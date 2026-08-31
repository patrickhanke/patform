"use client";

import { useCallback, useMemo } from "react";
import {
	CreateColumnHookProps,
	ColumnClasses,
	UpdateColumnData
} from "../types";
import { ColumnDef } from "@tanstack/react-table";
import { useDataHandlerSecure } from "@repo/provider";
import {
	ClassState,
	EventDate,
	EventTime,
	LanguageValue,
	PatstoreUser,
	PersonClass,
	Team,
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
	TableColumnImages,
	LatLng,
	usePageData
} from "@repo/ui";
import { get } from "lodash-es";
import { IconButton } from "@repo/ui";
import {
	TableColumnDatesField,
	TableColumnDeleteField,
	TableColumnEditContent,
	TableColumnEditDate,
	TableColumnEditField,
	TableColumnTimesField,
	TableColumnEmailSettings,
	TableColumnLang
} from "../content";
import {
	TableColumnFile,
	TableColumnDocuments,
	TableColumnUser,
	TableColumnUserRole,
	TableColumnVideo,
	TableColumnLocation,
	TableColumnHiddenField
} from "../components";
import { Loader } from "../../../Overlays/Loader";

export const PLACEHOLDER_ROW_PREFIX = "__placeholder_";

export const createPlaceholderRows = <T extends { objectId?: string }>(
	count: number
): T[] =>
	Array.from({ length: count }, (_, index) => ({
		objectId: `${PLACEHOLDER_ROW_PREFIX}${index}`
	})) as T[];

const isPlaceholderRow = (row: unknown): boolean => {
	const objectId = (row as { objectId?: string })?.objectId;
	return (
		typeof objectId === "string" &&
		objectId.startsWith(PLACEHOLDER_ROW_PREFIX)
	);
};

const PLACEHOLDER_CELL = <Loader width="100%" height="24px" />;

const TEXT_DEBOUNCE_MS = 300;

const getLiveRow = <T extends { objectId?: string }>(
	rows: T[] | null | undefined,
	row: T
): T => {
	if (!Array.isArray(rows) || !row.objectId) return row;
	return rows.find((item) => item.objectId === row.objectId) ?? row;
};

const withPlaceholderCell = <T,>(column: ColumnDef<T>): ColumnDef<T> => {
	const originalCell = column.cell;

	return {
		...column,
		cell: (info) => {
			if (isPlaceholderRow(info.row.original)) {
				return PLACEHOLDER_CELL;
			}
			if (typeof originalCell === "function") {
				return originalCell(info);
			}
			return info.getValue();
		}
	};
};

const useCreateColumns = <T extends ColumnClasses>({
	data,
	categories = [],
	fields = [],
	settings = [],
	className,
	refetch,
	constants,
	editLink,
	disableCategory,
	useMasterKey = false,
	editDisabled = false,
	hasEmailSettings = false,
	currentModule,
	initialData
}: CreateColumnHookProps<T>) => {
	const { updateData } = useDataHandlerSecure(useMasterKey);
	const updateColumnData: UpdateColumnData = useCallback(
		async ({ objectId, updateObject, feedback }) => {
			await updateData({
				className,
				objectId,
				updateObject: updateObject as {
					[key: string]:
						| string
						| number
						| boolean
						| object
						| Array<unknown>
						| undefined;
				},
				feedback
			});
			if (refetch) {
				refetch();
			}
		},
		[className, refetch]
	);

	const { data: pageRows, setRowData } = usePageData<T[]>(
		{ initialData },
		initialData !== undefined
			? {
					className,
					collection: true,
					useMasterKey,
					updateObject: () => ({}),
					message: "Gespeichert"
				}
			: undefined
	);

	const persistRow = useCallback(
		async (
			objectId: string,
			fieldId: string,
			value:
				| object
				| string
				| number
				| string[]
				| boolean
				| null
				| undefined,
			feedback: string,
			debounce?: number
		) => {
			if (initialData !== undefined) {
				setRowData(objectId, fieldId, value as never, debounce);
				return;
			}
			await updateColumnData({
				objectId,
				updateObject: { [fieldId]: value },
				feedback
			});
		},
		[initialData, setRowData, updateColumnData]
	);

	const handleImageChange = useCallback(
		(objectId: string, columnId: string | number) =>
			(value: string | object | number) =>
				persistRow(
					objectId,
					String(columnId),
					value,
					"Bilder aktualisiert"
				),
		[persistRow]
	);

	const columns = useMemo(() => {
		const columnArray: ColumnDef<T>[] = [];
		data.forEach((columnElement) => {
			if (
				columnElement.type === "string" ||
				columnElement.type === "edit_string"
			) {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return columnElement.id === "email" &&
							className === "User" ? (
							<TableColumnHiddenField
								id={live.objectId}
								className={className}
								field={columnElement.id}
							/>
						) : (
							<TableColumnString
								value={live[columnElement.id] as string}
								isLink={columnElement.id === "link"}
								isEditable={
									columnElement.type === "edit_string"
										? true
										: false
								}
								onChange={(value: string) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Text aktualisiert",
										TEXT_DEBOUNCE_MS
									)
								}
							/>
						);
					},
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
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<PatstoreSelectImages
								key={live.objectId}
								image={
									live[columnElement.id] as string | string[]
								}
								maxFileCount={
									columnElement.type === "gallery" ? 60 : 1
								}
								onChange={handleImageChange(
									live.objectId,
									columnElement.id as string
								)}
							/>
						);
					},
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
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnTextfield
								value={live[columnElement.id] as string}
								isEditable={
									columnElement.type === "edit_textfield"
										? true
										: false
								}
								onChange={(value: string) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Text aktualisiert",
										TEXT_DEBOUNCE_MS
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "texteditor") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnTexteditor
								value={live[columnElement.id] as string}
								isEditable={true}
								onChange={(value: string) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Text aktualisiert",
										TEXT_DEBOUNCE_MS
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_dates") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnDatesField
								initialDates={
									live[columnElement.id] as EventDate[]
								}
								onChange={(value: EventDate[]) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Termin aktualisiert"
									)
								}
							/>
						);
					},
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
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnDate
								date={live[columnElement.id] as string}
								onChange={(value: string) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Datum aktualisiert"
									)
								}
								isEditable={
									columnElement.type === "date_picker"
										? true
										: false
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "video") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnVideo
								value={live[columnElement.id] as string}
								onChange={(filePath: string) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										filePath,
										"Video aktualisiert"
									)
								}
								id={live.objectId}
							/>
						);
					},
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (
				columnElement.type === "geopoint" ||
				columnElement.type === "edit_geopoint"
			) {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnGeopoint
								value={
									live[columnElement.id] as LatitudeLongitude
								}
								isEditable={
									columnElement.type === "edit_geopoint"
										? true
										: false
								}
								onChange={(value: LatLng) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										{
											__type: "GeoPoint",
											latitude: value.lat,
											longitude: value.lng
										},
										"GeoPoint aktualisiert"
									)
								}
							/>
						);
					},
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
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnEditState
								value={live[columnElement.id] as string}
								isEditable={
									columnElement.disabled
										? columnElement.disabled(live)
										: true
								}
								options={get(constants, columnElement.id, [
									{
										value: "published",
										label: "Veröffentlicht",
										color: "green"
									},
									{
										value: "draft",
										label: "Entwurf",
										color: "yellow"
									}
								])}
								onChange={(value: ClassState) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value.value,
										"Status aktualisiert"
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false
				} as ColumnDef<T>);
			}
			if (
				columnElement.type === "image" ||
				columnElement.type === "image_preview"
			) {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnImage
							file={getLiveRow(pageRows, row)["file"]}
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
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnPerson
								isEditable={
									columnElement.type === "edit_person"
										? true
										: false
								}
								value={live[columnElement.id] as PersonClass}
								onChange={(value: string) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										{
											__type: "Pointer",
											className: "Person",
											objectId: value
										},
										"Person aktualisiert"
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "location") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnLocation
								isEditable={true}
								value={live[columnElement.id] as string}
								onChange={(value: string | null) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Ort aktualisiert"
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_persons") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnPersons
								isEditable={
									columnElement.type === "edit_person" ||
									columnElement.type === "edit_persons"
										? true
										: false
								}
								value={
									(live[columnElement.id] as string[]) ||
									([] as string[])
								}
								onChange={(values: string[]) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										values,
										"Personen aktualisiert"
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_times") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnTimesField
								initialTimes={
									live[columnElement.id] as EventTime[]
								}
								onChange={(value: EventTime[]) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Zeiten aktualisiert"
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_color") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnEditColor
								value={live[columnElement.id] as ColorValues}
								onChange={(value: string) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Farbe geändert"
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_team") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnEditTeam
								initialData={live[columnElement.id] as Team}
								onChange={(value: Team) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Team aktualisiert"
									)
								}
							/>
						);
					},
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
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnDocuments
								value={
									live[columnElement.id] || ([] as string[])
								}
								onChange={(value: string[]) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Dokumente aktualisiert"
									)
								}
							/>
						);
					},
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
						<>
							<TableColumnEditDate
								value={row[columnElement.id] as EventDate}
								onChange={async (value: EventDate) => {
									await updateData({
										className: "Appointment",
										objectId: row.objectId,
										updateObject: {
											[columnElement.id]: value
										},
										feedback: "Datum aktualisiert"
									});
									refetch();
								}}
							/>
						</>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false,
					sortingFn: columnElement.sortingFn ?? undefined
				} as ColumnDef<T>);
			}
			if (columnElement.type === "user") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnUser
							value={row[columnElement.id] as PatstoreUser}
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
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnEditBoolean
								value={live[columnElement.id] as boolean}
								onChange={(value: boolean) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Wert aktualisiert"
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: columnElement.enableSorting ?? false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_role") {
				columnArray.push({
					accessorFn: (row) => (
						<TableColumnUserRole user={row} refetch={refetch} />
					),
					header: () => <span>Rolle</span>,
					id: "role",
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				});
			}
			if (columnElement.type === "content") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return live?.type === "text" ? (
							<TableColumnTexteditor
								value={live[columnElement.id]?.value as string}
								isEditable={true}
								onChange={(value: string) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										{
											type: live.type,
											value
										},
										"Text aktualisiert",
										TEXT_DEBOUNCE_MS
									)
								}
							/>
						) : (
							<TableColumnImages
								value={
									live[columnElement.id] as string | string[]
								}
								maxFileCount={
									columnElement.type === "gallery" ? 20 : 1
								}
								onChange={(value: string | string[]) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										{
											type: live.type,
											value: value
										},
										"Bilder aktualisiert"
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "edit_content") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnEditContent
								initialData={
									live[columnElement.id] as WebpageContent[]
								}
								onChange={(value: WebpageContent[]) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Inhalt aktualisiert"
									)
								}
							/>
						);
					},
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "lang") {
				columnArray.push({
					accessorFn: (row) => {
						const live = getLiveRow(pageRows, row);
						return (
							<TableColumnLang
								value={live[columnElement.id] as LanguageValue}
								languages={
									currentModule?.settings?.languages || []
								}
								onChange={(value: string) =>
									persistRow(
										live.objectId,
										columnElement.id as string,
										value,
										"Inhalt aktualisiert"
									)
								}
							/>
						);
					},
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
							value={row["objectId"] as string}
						/>
					),
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: (info) => info.getValue(),
					footer: (info) => info.column.id,
					enableSorting: false
				} as ColumnDef<T>);
			}
			if (columnElement.type === "custom") {
				columnArray.push({
					accessorFn: (row) => columnElement?.render?.(row),
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
				accessorFn: (row) => {
					const live = getLiveRow(pageRows, row);
					return (
						<TableColumnCategory
							category={category}
							isEditable={
								disableCategory
									? !disableCategory(live, category.label)
									: true
							}
							categories={live.categories || []}
							onChange={(nextCategories: string[]) =>
								persistRow(
									live.objectId,
									"categories",
									nextCategories,
									"Kategorie aktualisiert"
								)
							}
						/>
					);
				},
				header: () => <span>{category.label}</span>,
				id: category.id,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false,
				sortingFn: undefined // Default sortingFn
			} as ColumnDef<T>);
		});

		if (editDisabled === false) {
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
							{hasEmailSettings && (
								<TableColumnEmailSettings
									userId={row.objectId}
									emails={row.emails}
									refetch={refetch}
								/>
							)}
							{fields.length > 0 && (
								<TableColumnEditField
									objectId={row.objectId}
									className={className}
									dataFields={fields}
								/>
							)}
							{settings?.length > 0 && (
								<TableColumnEditField
									objectId={row.objectId}
									className={className}
									dataFields={settings}
									type="setting"
								/>
							)}
							<TableColumnDeleteField
								objectId={row.objectId}
								className={className}
								refetch={refetch}
								useMasterKey={useMasterKey}
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
		}

		return columnArray.map(withPlaceholderCell);
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
		handleImageChange,
		persistRow,
		pageRows,
		settings,
		currentModule,
		editDisabled,
		hasEmailSettings,
		useMasterKey,
		updateData
	]);

	return columns;
};

export default useCreateColumns;
