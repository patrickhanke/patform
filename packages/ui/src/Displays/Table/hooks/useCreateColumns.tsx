'use client';

import { useMemo } from 'react';
import { CreateColumnHookProps, ColumnClasses } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import TableColumnString from '../components/TableColumnString';
import { useDataHandler } from '@repo/provider';
import TableColumnImage from '../components/TableColumnImage';
import TableColumnTextfield from '../components/TableColumnTextfield';
import TableColumnCategory from '../components/TableColumnCategory';
import TableColumnEditField from '../content/TableColumnEditField';
import TableColumnDeleteField from '../content/TableColumnDeleteField/TableColumnDeleteField';
import TableColumnDatesField from '../content/TableColumnDatesField';
import { EventDate } from '@repo/types';

const useCreateColumns = <T extends ColumnClasses>({ data, categories = [], fields = [], className, refetch }: CreateColumnHookProps<T>)  => {
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