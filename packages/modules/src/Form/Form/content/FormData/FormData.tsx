import { useMemo } from "react";
import GET_FORM_DATA from "./constants/GET_FORM_DATA";
import ViewFormData from "./components/ViewFormData";
import { Table } from "@repo/ui";
import { ColumnDef } from '../../../../../../ui/src/Displays/Table/types';

const { useQuery } = require( '@apollo/client');

const FormData = ({formId}: {formId: string}) => {
	const {data} = useQuery(GET_FORM_DATA, {
        variables: {
            id: formId
        },
        fetchPolicy: 'no-cache'
    
    });


    const formData = useMemo(() => {
		const formDataArray: FormData[] = [];
		if (data) {

			data.objects.findData.results.forEach((fData: FormData) =>  {
				formDataArray.push(fData);
			});
		}
		return formDataArray;
	}, [data]);

	interface FormData {
		position: number;
		createdAt: string;
		data: any;
	}

	const columns: ColumnDef<FormData>[] = useMemo(() => [
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
    <div>
        <Table
			data={formData}
			columns={columns}
		/>
    </div>
  )
}

export default FormData