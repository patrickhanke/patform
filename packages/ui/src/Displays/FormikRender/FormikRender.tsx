'use client';

import * as Yup from 'yup';
import { Formik } from 'formik';
import FormSubmitStore from './components/FormSubmitStore';
import RenderFields from './content/RenderFields';
import './styles.scss';
import { IntFormikRender } from './types';
import createYupSchema from './functions/createYupSchema';

const FormikRender  = ({fields, data, formSubmitHandler}: IntFormikRender) => {
	console.log(Yup.object().shape(Object.fromEntries(fields.map(field => [field.name, createYupSchema(field.validation)])) ));
	
	return (
		<Formik 
			initialValues={data ? data : Object.fromEntries(fields.map(field => [field.name, field.initialValue]))}
			onSubmit={ values => formSubmitHandler(values)}
			validationSchema={Yup.object().shape(Object.fromEntries(fields.map(field => [field.name, createYupSchema(field.validation)])) )}
			validateOnMount
			enableReinitialize
		> 
			{({handleSubmit, handleBlur, values, handleChange, setFieldValue, getFieldMeta}) => (
				<form onSubmit={handleSubmit} className='form_container'>
					<RenderFields
						fields={fields}
						getFieldMeta={getFieldMeta}
						handleBlur={handleBlur}
						values={values}
						setFieldValue={setFieldValue}
						handleChange={handleChange}
					/>
					<FormSubmitStore />
				</form>
			)}
		</Formik>
	);
};

export default FormikRender;