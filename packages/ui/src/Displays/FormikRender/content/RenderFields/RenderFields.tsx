import React from 'react';
import { FastField, FastFieldProps } from 'formik';
import Toggle from './components/Toggle';
import getSelectValue from './functions/getSelectValue';
import { RenderFieldsType } from './types';
import './styles.scss';
import { FileUploader, Select } from '@repo/ui';
import { Field } from '../../types';
import Input from './components/Input';
import TextArea from './components/TextArea';
import ColorPicker from './components/ColorPicker';
import ImageUpload from './components/ImageUpload';
import TextEditor from './components/TextEditor';
import getPointerValue from './functions/getPointerValue';
import PersonSelect from './components/PersonSelect';

const RenderFields = ({fields, getFieldMeta, handleChange, values, handleBlur, setFieldValue, isHorizontal, setSecondaryContent}: RenderFieldsType) => 
	<>
		{fields.map((field: Field) => 
			<React.Fragment key={field.id ? field.id : field.name}>
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
								<ImageUpload
									fieldValues={fieldValues}
									field={field}
									setFieldValue={setFieldValue}
									isHorizontal={isHorizontal}
								/>
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
								<FileUploader
									type={field.type}
									value={fieldValues}
									returnType={field.type === 'file' ? 'string' : 'array'}
									field={field}
									onChange={newValues => setFieldValue(field.name, newValues, true)}
									setSecondaryContent={setSecondaryContent}
								/>
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
				{(field.type === 'pointer_select') &&
					<div className={isHorizontal ? 'form_horizontal_container' : ''}>
						<label htmlFor={field.name}>{field.label || field.name} </label>
						<Select 
							onChange={value => setFieldValue(field.name, {__type: 'Pointer', className: field?.options?.pointer_class, objectId: value.value }, true)}
							value={getPointerValue(values[field.name], field.select_options || [])}
							options={field.select_options}
							key={field.name}
						/>
					</div>
				}
				{(field.type === 'color') &&
						<ColorPicker 
							onChange={value => setFieldValue(field.name, value, true)}
							value={values[field.name]}
							key={field.name}
							label={field.label}
							isOverlay={true}
							isHorizontal={isHorizontal}
						/>
				}
				{field.type === 'texteditor' &&
					<TextEditor
						name={field.name}
						label={field.label}
						id={field.id}
						onChange={value => setFieldValue(field.name, value, true)}
						values={values}
						handleBlur={handleBlur}
						placeholder={field.placeholder}
						isHorizontal={isHorizontal}
						setSecondaryContent={setSecondaryContent}
					/>
				}
				{field.type === 'persons_select' &&
					<PersonSelect
						name={field.name}
						label={field.label}
						onChange={value => setFieldValue(field.name, value, true)}
						values={values}
						placeholder={field.placeholder}
						isHorizontal={isHorizontal}
					/>
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
