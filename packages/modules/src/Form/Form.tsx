
'use client';

const { useQuery } = require('@apollo/client');
import { PageLayout, Table } from '@repo/ui';
import { useMemo } from 'react';
import GET_FORM_DATA from './constants/GET_FORM_DATA';
import ViewFormData from './components/ViewFormData';

const FormModule = () => {
	const {data} = useQuery(GET_FORM_DATA, {fetchPolicy: 'no-cache'});

	const formData = useMemo(() => {
		const formDataArray = [];
		if (data) {

			data.objects.findForms.results.forEach((fData) =>  {
				formDataArray.push(fData);
			});
		}

		return formDataArray;
	}, [data]);

	const columns = useMemo(() => [
		{
			accessorFn: (row, index) => row.position || index + 1 ,
			header: () => <span>Position</span>,
			id: 'position'
		},
		{
			header: () => <span>Datum</span>,
			id: 'createdAt',
			accessorKey: 'createdAt'
		} ,
		{
			accessorFn: (row) => <ViewFormData data={row.data} />,
			header: () => <span>Ansehen</span>,
			id: 'edit',
			cell: info => info.getValue(),
			footer: info => info.column.id
		} 
		
	], []);

	return (
		<PageLayout>
				<Table
					data={formData}
					columns={columns}
				/>

		</PageLayout>
	);
};

export default FormModule;