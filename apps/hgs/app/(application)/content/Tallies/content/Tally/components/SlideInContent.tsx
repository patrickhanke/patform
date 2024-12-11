import React, { useState } from 'react';
import TallyDescription from '../content/TallyDescription';
import styles from '../Tally.module.scss';
import { useQuery } from '@apollo/client';
import { GET_TALLY_DESCRIPTION, GET_TALLY_ENTRIES } from '@queries';
import getLastEntry from '../functions/getLastEntry';
import { getDateStringsFromIso } from '@provider';
import TallyEntries from '../content/TallyEntries';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { PiClockCountdown } from 'react-icons/pi';
import { SlideInRight, SwitchButtons } from '@repo/ui';

const buttonStates = [
	{
		value: 'entries',
		label: 'Einträge'
	},
	{
		value: 'description',
		label: 'Beschreibung'
	}
];

const SlideInContent = ({title, tallyId}: {title: string, tallyId: string}) => {
	const [buttonState, setButtonState] = useState(buttonStates[0]);
	const [showDetails, setShowDetails] = useState(false);
	const {data: descriptionData, refetch: refetchDescription} = useQuery(GET_TALLY_DESCRIPTION, {
		variables: {id: tallyId},
		notifyOnNetworkStatusChange: true
	});

	const {data: entriesData, refetch: refetchEntries} = useQuery(GET_TALLY_ENTRIES, {
		variables: {id: tallyId},
		notifyOnNetworkStatusChange: true
	});

	return (
		<>
			<div className={styles.description_preview_container}>
				<div
					className={styles.description_preview_header}
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[1]);
					}}
				>
					<IoDocumentTextOutline  />
					<p>
						Beschreibung:
					</p>
				</div>
				<div className={styles.description_preview_content}>
					{descriptionData && <div dangerouslySetInnerHTML={{__html: descriptionData.objects.getTally.description }} /> || ''}
				</div>
			</div>
			<div className={styles.last_entry_container}>
				<div
					className={styles.description_preview_header}
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[0]);
					}}
				>
					<PiClockCountdown />
					<p>
						Letzter Eintrag:
					</p>
				</div>
				<div className={styles.description_preview_content}>
					{entriesData && entriesData.objects.getTally.entries ?
						<p>
							{`${getLastEntry(entriesData.objects.getTally.entries)?.value?.toString()}  (${getDateStringsFromIso( getLastEntry(entriesData.objects.getTally.entries)?.date).datum })`}
						</p>
						:
						<p>
							-
						</p>
					}
				</div>
			</div>
			<SlideInRight isOpen={showDetails} setIsOpen={setShowDetails} header={title} >
				<div className={styles.tally_slidein_content}>
					<div className={styles.tally_slidein_header}>
						<SwitchButtons
							buttonStates={buttonStates}
							currentStates={buttonState}
							changeHandler={setButtonState}
							underlineButtons
						/>
					</div>
					<div className={styles.tally_slidein_content_container}>
						{buttonState.value === 'description' && <TallyDescription tallyId={tallyId} />}
						{buttonState.value === 'entries' && <TallyEntries tallyId={tallyId} entries={entriesData?.objects?.getTally?.entries} refetch={refetchEntries} />}
					</div>
				</div>
			</SlideInRight>
		</>
	);
};

export default SlideInContent;