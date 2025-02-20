import { generateGraphQLQuery } from '@provider';
import {  Service } from '@types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import ServiceCell from '../content/ServiceCell';
import { ServiceData, UsePropertyTableColumns } from '../types';

const useTableColumns: (T: UsePropertyTableColumns) => ColumnDef<ServiceData>[] = ({refetch, addEditService, setAddEditService}) => { 

	const {data} = useQuery(generateGraphQLQuery({
		type: 'find' , 
		objectName: 'Service', 
		fields: ['objectId', 'name', 'time']})
	)

	console.log(data);
	

	const columns: ColumnDef<ServiceData>[] = useMemo(() => {
		const columnsArray: ColumnDef<ServiceData>[] = [
			{
				accessorKey: 'name',
				header: () => <span>Name</span>,
				cell: info => info.getValue(),
				footer: info => info.column.id,
				sortingFn: 'alphanumeric'
			},
		];
		
		if (data) {
			const services = data.objects.findService.results;
			console.log(services);
			services.map((service: Service) => {
				columnsArray.push({
					accessorFn: row => (
						<ServiceCell 
							services={row || undefined} 
							id={service.objectId} 
							serviceName={service.name} 
							propertyId={row.objectId}
							propertyName={row.name} 
							refetch={refetch} 
							addEditService={addEditService}
							setAddEditService={setAddEditService}
						/>
					),
					header: () => <span>{service.name}</span>,
					id: service.objectId,
					cell: info => info.getValue(),
					footer: info => info.column.id,
					sortingFn: 'alphanumeric'
				},)
			})
		}

		return columnsArray;
	}, [data]);

	console.log(columns);
	

	return columns;
};

export default useTableColumns;