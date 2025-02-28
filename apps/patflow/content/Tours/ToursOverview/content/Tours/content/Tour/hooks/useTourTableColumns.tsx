import { generateGraphQLQuery } from '@provider';
import {  Service } from '@types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ServiceData, UseTourTableColumns } from '../types';
import TourCell from '../components/TourCell';

const useTourTableColumns: (T: UseTourTableColumns) => ColumnDef<ServiceData>[] = ({workerId, refetch, year}) => { 
	const {data} = useQuery(generateGraphQLQuery({
		type: 'find' , 
		objectName: 'Service', 
		fields: ['objectId', 'name', 'is_active', 'description']})
	)

	const columns: ColumnDef<ServiceData>[] = useMemo(() => {
		const columnsArray: ColumnDef<ServiceData>[] = [
			{
				accessorKey: 'name',
				header: () => <span>Name</span>,
				id: 'name',
				cell: info => info.getValue(),
				footer: info => info.column.id,
				sortingFn: 'alphanumeric'
			},
		];
		
		if (data) {
			const services = data.objects.findService.results;
			services.map((service: Service) => {
				if (service.is_active) {
					columnsArray.push({
						accessorFn: row => (
							<TourCell 
								key={service.objectId}
								services={row || undefined} 
								id={service.objectId} 
								serviceName={service.name} 
								propertyId={row.objectId}
								propertyName={row.name} 
								userId={workerId}
								refetch={refetch}
								year={year}
								// setAddEditService={setAddEditService}
							/>
						),
						header: () => <span>{service.name}</span>,
						maxSize: 60,
						id: service.objectId,
						cell: info => info.getValue(),
						footer: info => info.column.id,
						sortingFn: 'alphanumeric'
					})
				};

			})
		}

		return columnsArray;
	}, [data, workerId, year]);

	return columns;
};

export default useTourTableColumns;