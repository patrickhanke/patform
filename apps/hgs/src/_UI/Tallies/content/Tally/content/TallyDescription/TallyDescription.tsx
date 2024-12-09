import { Loader, Editor } from '@/_UI';
import { useDataHandler } from '@/provider';
import { GET_TALLY_DESCRIPTION } from '@/queries';
import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { IoDocumentTextOutline } from 'react-icons/io5';
import styles from './TallyDescription.module.scss';

const TallyDescription = ({tallyId}: {tallyId: string}) => {
	const {updateData} = useDataHandler();

	const [editDescription, setEditDescription] = useState(false);
	const {data, refetch} = useQuery(GET_TALLY_DESCRIPTION, {
		variables: {id: tallyId},
		notifyOnNetworkStatusChange: true
	});

	const descriptionDataHandler = async (value: string) => {
		await updateData({
			className: 'Tally',
			objectId: tallyId,
			updateObject: {
				description: value
			}
		});
		refetch();
	};

	if (data) return (
		<div className={styles.description_container}> 
			<div className={styles.description_content}>
				<div className={styles.description_header}>
					<IoDocumentTextOutline  />
					<label htmlFor='description'>Beschreibung</label>
				</div>
				<div className={styles.description_content_text}>
					
					<Editor
						onChange={descriptionDataHandler}
						content={data.objects.getTally.description}
						withToolbar={false}
						onClickOutside={() => {
							if (editDescription) {
								setEditDescription(false);
							}
						}}
						withPopover
						id='description'
					/>
					
				</div>

			</div>
		</div>
	);
	return <Loader width='100%' height='240px' />;
};

export default TallyDescription;