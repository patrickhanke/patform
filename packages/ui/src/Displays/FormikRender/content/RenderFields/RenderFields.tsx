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
import ColorPicker from './components/ColorPicker';
import { ImageUploader } from '@repo/modules';

const RenderFields = ({fields, getFieldMeta, handleChange, values, handleBlur, setFieldValue, isHorizontal}: RenderFieldsType) => 
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
						isHorizontal={isHorizontal}
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
						isHorizontal={isHorizontal}
					
					/>
				}
				{(field.type === 'image') &&
					<div>
						<FastField name={field.name}>
							{({
								field: fieldValues
							}: FastFieldProps) => (
								<div className={isHorizontal ? 'form_horizontal_container' : ''}>
									<label htmlFor={fieldValues.name}>{field.label} </label>
									<div style={{maxWidth: '480px', maxHeight: '180px'}}>
										<ImageUploader
											onChange={value => setFieldValue(field.name, value)}
											path={process.env.BYTESCALE_IMAGE_FOLDER as string}
											returnType={field?.options?.return_type || 'array'}
											maxFileCount={field?.options?.max_file_count || 10}
										/>
									</div>
								</div>
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
								<div className={isHorizontal ? 'form_horizontal_container' : ''}>
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
								</div>
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
								<div className={isHorizontal ? 'form_horizontal_container' : ''}>
									<label htmlFor={fieldValues.name}>{fieldValues.name} </label>
									<Toggle
										toggleState={values[field.name]} 
										toggleHandler={(value: boolean) => setFieldValue(field.name, value, true)}
										disabled={false}
										label={undefined}
										labelBefore={false}
									/>
								</div>
							)}
						</FastField>
					</div>
				}
				{(field.type === 'select') &&
					<div className={isHorizontal ? 'form_horizontal_container' : ''}>
						<label htmlFor={field.name}>{field.label || field.name} </label>
						<Select 
							onChange={value => setFieldValue(field.name, field.dataType === 'string' ?  value.value : value, true)}
							value={getSelectValue(values, field)}
							options={field.select_options}
							key={field.name}
						/>
					</div>
				}
				{(field.type === 'color') &&
					<div className={isHorizontal ? 'form_horizontal_container' : ''}>
						<label htmlFor={field.name}>{field.label || field.name} </label>
						<ColorPicker 
							onChange={value => setFieldValue(field.name, value, true)}
							value={getSelectValue(values, field)}
							key={field.name}
							isOverlay={true}
							alignRight={isHorizontal}
						/>
					</div>
				}
				{getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
					<div className={'error_message'}>{getFieldMeta(field.name).error}</div>
					: 
					null
				}
				{isHorizontal && <div className='form_divider' />}
			</React.Fragment>
		)}
	</>;

export default RenderFields;
