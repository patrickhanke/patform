import React, { useState } from 'react';
import { Recipient } from '@repo/types';

const FormRecipient = ({initialRecipient}: {initialRecipient: Recipient}) => {
	const [recipient, setRecipient] = useState(initialRecipient);
	const [edit, setEdit] = useState(false);
	return edit ? 
		<div>
			<input value={recipient.name} onChange={e => setRecipient({...recipient, name: e.target.value})} />
			<input value={recipient.email} onChange={e => setRecipient({...recipient, email: e.target.value})} />
			<button onClick={() => setEdit(false)}>Speichern</button>
		</div>
		:
		<div>
			<p>{recipient.name}</p>
			<p>{recipient.email}</p>
		</div>;	
	
};

export default FormRecipient;