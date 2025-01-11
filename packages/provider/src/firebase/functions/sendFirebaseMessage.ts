import { axiosclient } from '@repo/provider';
import { SendMessage } from '../types';

const sendFirebaseMessage: SendMessage = async ({notification, data, tokens}) =>  {
	await axiosclient().post('functions/send-message', {
		notification,
		data,
		tokens
	})
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.error(error);
		});
};

export default sendFirebaseMessage;