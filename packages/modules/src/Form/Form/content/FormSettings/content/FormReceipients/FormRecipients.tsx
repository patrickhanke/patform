import React, { useState } from 'react';
import FormReceipient from './components/FormRecipient';
import { CreateButton } from '@repo/ui';
import { v4 } from 'uuid';
import { FormRecipientsProps } from './types';
import { Recipient } from '@repo/types';

const FormRecipients: React.FC<FormRecipientsProps> = ({initialRecipients = []}) => {
	const [recipients, setRecipients] = useState<Recipient[]>(initialRecipients);
  
	return (
		<div className='content_element'>
			<h3>Empfänger</h3>
			{recipients.map(recipient => <FormReceipient key={recipient.id} initialRecipient={recipient} />)}
			<CreateButton 
				size='small'
				text='Empfänger hinzufügen'
				onClick={() => {
					const recipientsCopy = [...recipients];
					recipientsCopy.push({
						email: '',
						name: '',
						id: v4()
					});
	  } }
			/>
		</div>
	);
};

export default FormRecipients;