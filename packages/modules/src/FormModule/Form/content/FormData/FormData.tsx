import { useMemo } from "react";
import GET_FORM_DATA from "./constants/GET_FORM_DATA";
import ViewFormData from "./components/ViewFormData";
import { Table } from "@repo/ui";

const { useQuery } = require( '@apollo/client');

const FormData = ({formId}) => {
	const {data} = useQuery(GET_FORM_DATA, {
        variables: {
            id: formId
        },
        fetchPolicy: 'no-cache'
    
    });


    const formData = useMemo(() => {
		const formDataArray = [];
		if (data) {

			data.objects.findData.results.forEach((fData) =>  {
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
    <div>
        <Table
					data={formData}
					columns={columns}
				/>
    </div>
  )
}

export default FormData