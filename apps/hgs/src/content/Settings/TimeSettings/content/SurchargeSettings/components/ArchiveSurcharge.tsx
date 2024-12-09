import { DatePicker, Modal } from '@/_UI';
import { useDataHandler } from '@/provider';
import React, { useState } from 'react';
import { ArchiveSurchargeProps } from '../types';
import { formatISO9075 } from 'date-fns';

const ArchiveSurcharge: React.FC<ArchiveSurchargeProps> = ({deleteSurcharge, setDeleteSurcharge, refetch}) => {
	const {updateData} = useDataHandler();
	const [endDate, setEndDate] = useState<string | null>(null);
	return (
		<Modal
			isOpen={deleteSurcharge !== null}
			cancelButtonHandler={() => setDeleteSurcharge(null)}
			confirmButtonHandler={async () => {
				if (deleteSurcharge?.objectId) {
					await updateData({
						className: 'Surcharge',
						objectId: deleteSurcharge.objectId,
						updateObject: {
							active: false
						}
					});
				}
				await refetch();
				setDeleteSurcharge(null);
			}}
				
			header='Zuschlag archivieren'
			buttonDisabled={[false, !endDate]}
			errors={endDate ? [] : [{message: 'Bitte ein Enddatum angeben', key: 'end_date', id: 'end_date'}]}
		>
			<p>Sind Sie sicher dass sie den Zuschlag {deleteSurcharge?.name } archivieren möchten. Damit endet der Zuschlag zu dem angegebenen Datum.</p>
			<DatePicker 
				label='Enddatum'
				type='date'
				id='end_date' 
				defaultValue={formatISO9075(new Date(), {representation: 'date'})}
				onChange={(value) => setEndDate(value)}
			/>
		</Modal>
	);
};

export default ArchiveSurcharge;