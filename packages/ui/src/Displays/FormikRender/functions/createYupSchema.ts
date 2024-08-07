import { CreateYupSchemaFunction } from '../types';
import * as Yup from 'yup';

const createYupSchema: CreateYupSchemaFunction = (type, validation) => {
	let method = Yup.string();

	if (type === 'input' || type === 'url' || type === 'textarea') {
		method = Yup.string()
			.required(validation?.required || undefined)
			.min( validation?.min_length ? validation.min_length : 0, `Die Mindestlänge beträgt ${validation?.min_length}` )
			.max( validation?.max_length ? validation.max_length : 0, `Die Höchstlänge beträgt ${validation?.max_length}`);
	}
	
	return method;
};

export default createYupSchema;