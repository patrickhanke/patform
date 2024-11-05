'use client';

import { useMemo } from 'react';
import { CreateColumnHookProps, ColumnClasses, PersonOption } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import TableColumnString from '../components/TableColumnString';
import { useDataHandler } from '@repo/provider';
import TableColumnImage from '../components/TableColumnImage';
import TableColumnTextfield from '../components/TableColumnTextfield';
import TableColumnCategory from '../components/TableColumnCategory';
import TableColumnEditField from '../content/TableColumnEditField';
import TableColumnDeleteField from '../content/TableColumnDeleteField/TableColumnDeleteField';
import TableColumnDatesField from '../content/TableColumnDatesField';
import { ClassState, EventDate, EventTime } from '@repo/types';
import TableColumnDate from '../components/TableColumnDate';
import TableColumnTexteditor from '../components/TableColumnTexteditor';
import TableColumnGeopoint from '../components/TableColumnGeopoint';
import { MapPlace } from '../../Map';
import TableColumnEditState from '../components/TableColumnEditState';
import {get} from 'lodash';
import TableColumnGallery from '../components/TableColumnGallery';
import TableColumnPerson from '../components/TableColumnPerson';
import TableColumnTimesField from '../content/TableColumnTimesField';
import TableColumnPersons from '../components/TableColumnPersons';

const useCreateColumns = <T extends ColumnClasses>({ data, categories = [], fields = [], className, refetch, constants }: CreateColumnHookProps<T>)  => {
	const {updateData} = useDataHandler();
	
	const columns = useMemo(() => {
		const columnArray: ColumnDef<T>[] = [];
		data.forEach(columnElement => {
			if (columnElement.type === 'string' || columnElement.type === 'edit_string') {
				columnArray.push({
					accessorFn: row => 
						<TableColumnString
							value={row[columnElement.id] as string}  
							isEditable={columnElement.type === 'edit_string' ?  true : false}
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as ColumnDef<T>);
			}
			if (columnElement.type === 'image' || columnElement.type === 'edit_image') {
				columnArray.push({
					accessorFn: row => 
						<TableColumnImage
							url={row[columnElement.id] as string}  
							isEditable={columnElement.type === 'edit_image' ?  true : false}
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'textfield' || columnElement.type === 'edit_textfield') {
				columnArray.push({
					accessorFn: row => 
						<TableColumnTextfield
							value={row[columnElement.id] as string}  
							isEditable={columnElement.type === 'edit_textfield' ?  true : false}
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'texteditor') {
				columnArray.push({
					accessorFn: row => 
						<TableColumnTexteditor
							value={row[columnElement.id] as string}  
							isEditable={true}
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'edit_dates') {
				columnArray.push({
					accessorFn: row => 
						<TableColumnDatesField
							initialDates={row[columnElement.id] as EventDate[]}  
							onChange={async (value: EventDate[]) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'date') {
				columnArray.push({
					accessorFn: row => 
						<TableColumnDate
							date={row[columnElement.id] as string}  
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'geopoint' || columnElement.type === 'edit_geopoint') {
				columnArray.push({
					accessorFn: row => 
						<TableColumnGeopoint
							value={row[columnElement.id]}  
							isEditable={columnElement.type === 'edit_geopoint' ?  true : false}
							onChange={async (value: MapPlace) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'state' ||  columnElement.type === 'edit_state' ) {
				columnArray.push({
					accessorFn: row => get(constants,  columnElement.id, undefined) ?
						<TableColumnEditState
							value={row[columnElement.id]}  
							isEditable={columnElement.type === 'edit_state' ?  true : false}
							options={get(constants,  columnElement.id, [])}
							onChange={async (value: ClassState) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: value.value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>: <p className='error_message'>Keinen korrekten Status übergeben</p>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'gallery' ) {
				columnArray.push({
					accessorFn: row => 
						<TableColumnGallery
							value={row[columnElement.id]}  
							onChange={async (value: string[]) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'person' || columnElement.type === 'edit_person') {
				columnArray.push({
					accessorFn: row => 
						<TableColumnPerson
							isEditable={columnElement.type === 'edit_person' ?  true : false}
							value={row[columnElement.id]}  
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: {__type: 'Pointer', className: 'Person', objectId: value}}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'edit_persons') {
				columnArray.push({
					accessorFn: row => 
						<TableColumnPersons
							isEditable={columnElement.type === 'edit_person' || columnElement.type === 'edit_persons' ?  true : false}
							value={row[columnElement.id] || []}  
							onChange={async (values: string[]) => {
								console.log(values);
								
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: values}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'edit_times' ) {
				columnArray.push({
					accessorFn: row => 
						<TableColumnTimesField
							initialTimes={row[columnElement.id] as EventTime[]}  
							onChange={async (value: EventTime[]) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {[columnElement.id]: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>{columnElement.label}</span>,
					id: columnElement.id as string,
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
		});
		categories.map(category => {
			columnArray.push({
				accessorFn: row => 
					<TableColumnCategory
						category={category}  
						className={className}
						objectId={row.objectId}
						categories={row.categories || []} 
						refetch={refetch}                    
					/>,
				header: () => <span>{category.label}</span>,
				id: category.id,
				cell: info => info.getValue(),
				footer: info => info.column.id
			} as  ColumnDef<T>);
		});
		columnArray.push({
			accessorFn: row => 
				<div className='button_container'>
					{fields.length > 0 && <TableColumnEditField objectId={row.objectId} className={className} />}
					<TableColumnDeleteField objectId={row.objectId} className={className} refetch={refetch} />
				</div>,
			header: () => <span>Bearbeiten</span>,
			id: 'edit',
			cell: info => info.getValue(),
			footer: info => info.column.id
		});
        
		return columnArray;
	}, [data, className]);

	return columns;
};

export default useCreateColumns;