import React from 'react';
import { FastField, FastFieldProps } from 'formik';
import Toggle from './components/Toggle';
import getSelectValue from './functions/getSelectValue';
import { RenderFieldsType } from './types';
import './styles.scss';
import { Select } from '../../../../Inputs';

const RenderFields = ({fields, getFieldMeta, handleChange, values, handleBlur, setFieldValue}: RenderFieldsType) => 
	<>
		{fields.map(field => 
			<React.Fragment key={field.name}>
				{(field.type === 'input' || field.type === 'url' || field.type === 'number' || field.type === 'password')  &&
			<div>
				<label htmlFor={field.name}>{field.label || field.name} </label>
				<input 
					id={field.id}
					name={field.name}
					type={field.type}
					onChange={handleChange}
					defaultValue={values[field.name] || ''}
					onBlur={e => handleBlur(e.target.value)}
					placeholder={field.placeholder}
					key={field.name}
				/>
				{getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
					<div className='error_message'>{getFieldMeta(field.name).error}</div>
					: 
					null
				}
			</div>
				}
				{field.type === 'textarea' &&
			<div>
				<label htmlFor={field.name}>{field.label || field.name} </label>
				<textarea 
					id={field.id}
					name={field.name}
					onChange={handleChange}
					value={values[field.name] || ''}
					onBlur={e => handleBlur(e)}
					placeholder={field.placeholder}
					key={field.name}
					style={{minWidth: '240px', minHeight: '80px'}}
				/>
				
			</div>
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
						options={field.options}
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
