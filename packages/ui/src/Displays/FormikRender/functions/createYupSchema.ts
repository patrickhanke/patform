import { Field } from '../types';
import * as Yup from 'yup';

const createYupSchema = (validation: Field['validation']) => {
	if (validation === 'string_required') {
		return Yup.string().required('Pflichtfeld');
	}
   
	return undefined as any;
};

export default createYupSchema;