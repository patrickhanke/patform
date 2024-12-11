import { axiosclient } from '@/provider/data';
import { CreateTime } from '../types';

const createTime: CreateTime = async (data) => 
	await axiosclient()
		.post('/functions/create-time', {
			...data
		})
		.then(response => {
			console.log(response);
		})
		.catch(error => {
			console.log(error);
		});


export default createTime;

