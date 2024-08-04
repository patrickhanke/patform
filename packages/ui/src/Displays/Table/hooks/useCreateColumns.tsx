import { useMemo } from 'react';
import { CreateColumnHookProps, UseCreateColumnsHook } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import TableColumnString from '../components/TableColumnString'; // Ensure this import is correct
import { useDataHandler } from '@repo/provider';
import TableColumnImage from '../components/TableColumnImage';
import TableColumnTextfield from '../components/TableColumnTextfield';
import TableColumnCategory from '../components/TableColumnCategory';


const useCreateColumns: UseCreateColumnsHook = <T,>({ data, categories = [], fields = [], className, objectId, refetch }: CreateColumnHookProps<T>)  => {
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
									updateObject: {title: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>Titel</span>,
					id: 'title',
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
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
									updateObject: {title: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>Titel</span>,
					id: 'title',
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
			if (columnElement.type === 'textfield' || columnElement.type === 'edit_textfield') {
				columnArray.push({
					accessorFn: row => 
						<TableColumnTextfield
							url={row[columnElement.id] as string}  
							isEditable={columnElement.type === 'edit_textfield' ?  true : false}
							onChange={async (value: string) => {
								await updateData({
									className: className,
									objectId: row.objectId,
									updateObject: {title: value}
								});
								if (refetch) {
									refetch();
								}
							}}
						/>,
					header: () => <span>Titel</span>,
					id: 'title',
					cell: info => info.getValue(),
					footer: info => info.column.id
				} as  ColumnDef<T>);
			}
		});
		categories.map(category => {
			columnArray.push({
				accessorFn: row => 
					<TableColumnCategory
						category={category }  
						className={className}
						objectId={objectId}
						categories={row.categories}                        
						
					/>,
				header: () => <span>Titel</span>,
				id: 'title',
				cell: info => info.getValue(),
				footer: info => info.column.id
			} as  ColumnDef<T>);
		});


        
		return columnArray;
	}, [data]);

	return columns;
};

export default useCreateColumns;