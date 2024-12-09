'use client';

import React, { useMemo } from 'react';
import { Formik } from 'formik';
import RenderFields, { Field } from './content/RenderFields';
import styles from './FormikRender.module.scss';
import { set } from 'lodash';
import getConditionalField from './functions/getConditionalField';
import generateValidationSchema from './functions/generateValidationSchema';
import clsx from 'clsx';
import { ConditionalField, ConditionalFieldsComponent, FormikRenderComponent } from './types';
import FormSubmitStore from './components/FormSubmitStore';

const ConditionalFields = ({
	conditionalFields, 
	getFieldMeta, 
	setFieldValue,
	handleChange, 
	values, 
	handleBlur, 
	fields,
	highlightChanges
}: ConditionalFieldsComponent) => {
	
	const fieldsToDisplay =  useMemo(() => {
		const newFields = [...fields];

		const condFields: Array<ConditionalField> = [];
		conditionalFields.forEach(conField => {
			if (conField.cond_type === values[conField.cond_field]) {
				condFields.push(conField);
			}
		});

		condFields.forEach(condField => {
			const index = newFields.findIndex(field => field.name === condField.cond_field);
			const condFieldsToInsert = condField.fields.map(cf => ({...cf, is_conditional_field: true}));
			newFields.splice(index + 1, 0, ...condFieldsToInsert);
		});

		return newFields;
	}, [conditionalFields, values]);

	return (
		<RenderFields
			fields={fieldsToDisplay}
			getFieldMeta={getFieldMeta}
			handleBlur={handleBlur}
			values={values}
			setFieldValue={setFieldValue}
			handleChange={handleChange}
			highlightChanges={highlightChanges}
		/>
	);
};

const FormikRender  = ({
	fields = [], 
	conditionalFields= [], 
	apiClass, 
	id, 
	formValidationHandler, 
	useWithDebounce = false ,
	afterSaveFunction, 
	hasFullHeight = false ,
	labelBefore = false,
	highlightChanges = false, 
	valueReturnFunction,
	enableReinitialize=false
}: FormikRenderComponent) => {
	const initialValues = useMemo(() => {

		const fieldsCopy: Array<Field> = fields ;

		const createInitialValues = (conditionalFields: ConditionalField['fields']) => {
			const iniObject = {};
			
			conditionalFields.forEach(value => {
				set(iniObject, value.name, value.value);
			});
			return iniObject;
		};

		let iniValues: object = new Object;
		
		if (fieldsCopy.length > 0) {
			
			iniValues = {...Object.fromEntries(fieldsCopy.map(field => [field.name, field.value]))};
		}
		
		if (conditionalFields.length > 0) {
			iniValues = {
				...iniValues,
				...createInitialValues(getConditionalField(fieldsCopy, conditionalFields))
			};
		}
		return iniValues;

	}, [fields]);

	return (
		<Formik 
			initialValues={initialValues}
			// eslint-disable-next-line no-console
			onSubmit={values => {
				if (valueReturnFunction) {
					valueReturnFunction(values);
				}
				// console.log(valueReturnFunction);
			}}
			validationSchema={ generateValidationSchema(fields, false)}
			initialStatus='unchanged'
			validateOnChange={false}
			enableReinitialize={enableReinitialize}
		> 
			{({handleBlur, values, handleChange, setFieldValue, getFieldMeta }) => (
				<form className={clsx(styles.form_container)} style={{height: hasFullHeight ? '100%' : 'auto'}}>
					{conditionalFields.length === 0  &&
						<RenderFields
							fields={fields}
							getFieldMeta={getFieldMeta}
							handleBlur={handleBlur}
							values={values}
							setFieldValue={setFieldValue}
							handleChange={handleChange}
							apiClass={apiClass}
							id={id}
							afterSaveFunction={afterSaveFunction}
							labelBefore={labelBefore}
							highlightChanges={highlightChanges}
						/>
					}
					{conditionalFields.length > 0  &&
					<>
						<ConditionalFields
							fields={fields}
							conditionalFields={conditionalFields}
							getFieldMeta={getFieldMeta}
							handleBlur={handleBlur}
							values={values}
							setFieldValue={setFieldValue}
							handleChange={handleChange}
							highlightChanges={highlightChanges}
						/>
					</>
					}
					{fields.length > 0 && 
						<FormSubmitStore 
							formValidationHandler={formValidationHandler} 
							useWithDebounce={useWithDebounce} 
						/>
					}
				</form>
			)}
		</Formik>
	);
};

export default FormikRender;