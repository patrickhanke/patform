import React from 'react';
import { FastField, FastFieldProps } from 'formik';
import Toggle from './components/Toggle';
import getSelectValue from './functions/getSelectValue';
import { RenderFieldsType } from './types';
import './styles.scss';
import { Select } from '../../../../Inputs';
import { Field } from '../../types';
import Input from './components/Input';
import TextArea from './components/TextArea';

const RenderFields = ({fields, getFieldMeta, handleChange, values, handleBlur, setFieldValue}: RenderFieldsType) => 
	<>
		{fields.map((field: Field) => 
			<React.Fragment key={field.name}>
				{(field.type === 'input' || field.type === 'url' || field.type === 'number' || field.type === 'password')  &&
					<Input 
						name={field.name}
						label={field.label}
						id={field.id}
						type={field.type}
						handleChange={handleChange}
						values={values}
						handleBlur={handleBlur}
						placeholder={field.placeholder}
					/>
				}
				{field.type === 'textarea' &&
					<TextArea 
						name={field.name}
						label={field.label}
						id={field.id}
						handleChange={handleChange}
						values={values}
						handleBlur={handleBlur}
						placeholder={field.placeholder}
					
					/>
				}
				{(field.type === 'image') &&
			<div>
				<FastField name={field.name}>
					{({
						field: fieldValues
						// form: { touched, errors },  also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
						// meta
					}: FastFieldProps) => (
						<>
							<label htmlFor={fieldValues.name}>{fieldValues.name} </label>
							<input
								type='upload' 
								onChange={value => setFieldValue(fieldValues.name, value, true)}
								value={fieldValues.value}
								key={fieldValues.name}
							/>
							{!getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
								<div className={'warning_message'}>{getFieldMeta(field.name).error}</div>
								 : 
								null
							}
							{getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
								<div className={'error_message'}>{getFieldMeta(field.name).error}</div>
								 : 
								null
							}
						</>
					)}
				</FastField>
			</div>
				}
				{(field.type === 'file') &&
			<div>
				<FastField name={field.name}>
					{({
						field: fieldValues
						// form: { touched, errors },  also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
						// meta
					}: FastFieldProps) => (
						<>
							<label htmlFor={fieldValues.name}>{fieldValues.name} </label>
							<input 
								type='upload'
								onChange={value => setFieldValue(fieldValues.name, value, true)}
								value={fieldValues.value}
								key={fieldValues.name}
							/>
							{!fieldValues.value && !getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
								<div className={'warning_message'}>{getFieldMeta(field.name).error}</div>
								 : 
								null
							}
							{getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
								<div className={'error_message'}>{getFieldMeta(field.name).error}</div>
								 : 
								null
							}
						</>
					)}
				</FastField>
			</div>
				}
				{(field.type === 'toggle') &&
			<div>
				<FastField name={field.name}>
					{({
						field: fieldValues // { name, value, onChange, onBlur }
						// form: { touched, errors },  also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
						// meta
					}: FastFieldProps) => (
						<>
							<label htmlFor={fieldValues.name}>{fieldValues.name} </label>
							<Toggle
								toggleState={values[field.name]} 
								toggleHandler={(value: boolean) => setFieldValue(field.name, value, true)}
								disabled={false}
								label={undefined}
								labelBefore={false}
							/>
						</>
					)}
				</FastField>
				
			</div>
				}
				
				{(field.type === 'select') &&
			<>
				<label htmlFor={field.name}>{field.label || field.name} <br/>
					<Select 
						onChange={value => setFieldValue(field.name, field.dataType === 'string' ?  value.value : value, true)}
						value={getSelectValue(values, field)}
						options={field.select_options}
						key={field.name}
					/>
				</label>
			</>
				}
				{getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
					<div className={'error_message'}>{getFieldMeta(field.name).error}</div>
					: 
					null
				}

			</React.Fragment>
		)}
	</>;

export default RenderFields;
