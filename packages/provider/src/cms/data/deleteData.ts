
import { AxiosResponse } from 'axios';
import axiosclient from './axios';

const deleteData = async ({
	className, 
	objectId, 
	afterSaveHandler
}: {
	className: string, 
	objectId: string, 
	afterSaveHandler?: (objectId: string) => void,
	feedback?: string
}) => {
	await axiosclient().delete(`classes/${className}/${objectId}`)
		.then((response : AxiosResponse<any, any>) => {
			
			if (afterSaveHandler) {
				afterSaveHandler(response.data.objectId);
			}
		})
		.catch(error => {
			console.log(error);
		});
};

export default deleteData;