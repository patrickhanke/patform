import React, { Fragment, useState } from 'react';
import DatePicker from './components/DatePicker';
import { FastField, FastFieldProps, Field, FieldProps } from 'formik';
import Editor from './components/Editor';
import getSelectValue from './functions/getSelectValue';
import styles from './RenderFields.module.scss';
import SelectField from './components/SelectField';
import { get } from 'lodash';
import CreateOptions from './components/CreateOptions';
import SelectAndScale from './components/SelectAndScale';
import fieldConditionHandler from './functions/fieldConditionHandler';
import { uploadFile } from '@/provider';
import PointerSelectField from './components/PointerSelectField';
import Scale from './components/Scale';
import clsx from 'clsx';
import SelectToggle from './components/SelectToggle';
import ImagePreview from './components/ImagePreview';
import FilesInterface from './components/FilesInterface';
import ColorPicker from './components/ColorPicker';
import TimeInputField from './components/TimeInputField';
import { Field as FieldType, RenderFieldsComponent } from './types';

const RenderFields = ({
	fields, 
	getFieldMeta, 
	handleChange, 
	values, 
	handleBlur, 
	setFieldValue, 
	afterSaveFunction,
	id,
	apiClass,
	labelBefore=false,
	diagnosticMode=false,
	highlightChanges
}: RenderFieldsComponent) => {

	const fieldDisabledHandler = (field: FieldType) => {
		if (field.disabled) {
			if (typeof field.disabled === 'boolean') {
				return field.disabled;
			}
			return field.disabled(values);
		}
		return false;
	};

	console.log(values);
	

	return (
		<>
			<div className={styles.fields_container} >
				{fields.map(field => fieldConditionHandler(field, []) &&
					<Fragment key={field.name}>
						<div
							className={clsx('content_element', styles.question_container)}
							data-isconditionalfield={!!field.condition}
							data-labelbefore={labelBefore}
							key={field.name}
						>
							<label htmlFor={field.name} className={highlightChanges && getFieldMeta(field.name).initialValue !== field.value ? 'highlight' : ''} >
								{field.label || field.name} 
								{diagnosticMode && 
									<div className={styles.diagnostic_content}>
										{/* {typeof field.value === 'string' || 'number' && field.value } */}
									</div>
								}
							</label>
							{(field.type === 'input' || field.type === 'url' || field.type === 'password' || field.type === 'number')  &&
								<>
									<input 
										name={field.name}
										type={ field.dataType === 'number' ? 'number' : field.type}
										onChange={e => handleChange(e)}
										value={get( values, field.name, '' )}
										onBlur={e => handleBlur(e)}
										placeholder={field.placeholder}
										key={field.name}
										min={field.type === 'number' ? field?.options?.number_start_value : undefined}
										max={field.type === 'number' ? field?.options?.number_end_value : undefined}
										disabled={fieldDisabledHandler(field)}
										style={{
											width: field?.width ? field.width : 'inherit',
											textAlign: field?.text_align ? field.text_align : 'left'
										}}
									/>
								</>
							}
							{field.type === 'textarea' &&
								<>
									<textarea 
										name={field.name}
										onChange={e => handleChange(e)}
										value={values[field.name] || ''}
										onBlur={e => handleBlur(e)}
										placeholder={field.placeholder}
										key={field.name}
										style={{minWidth: '240px', minHeight: '80px'}}
									/>
								</>
							}
						
							{(field.type === 'file' || field.type === 'files' || field.type === 'image') &&
								<Fragment key={field.name}>
									<FastField name={field.name}>
										{({
											field: fieldValues
											// form: { touched, errors },  also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
											// meta
										}: FastFieldProps) => {
											
											return (
												<div >
													{field.type === 'image' && <ImagePreview image={fieldValues.value} /> }
													{field.type === 'files' && field.dataType === 'array' && 
														<FilesInterface 
															files={fieldValues.value} 
															afterSaveHandler={afterSaveFunction}
															apiClass={apiClass}
															fieldName={field.name}
															setFieldValue={setFieldValue}
															id={id}
														/> 
													}
													<input 
														type='file'
														onChange={async e => { 
															if (e?.target?.files) {
																const fileArray = fieldValues?.value ? [...fieldValues.value] : [];
																if (e.target.files.length > 1 ) {
																	for (const file of e.target.files) {
																		const uploadedFile =  await uploadFile({file: file, filename: field.name});
																		fileArray.push(uploadedFile);
																	}
																	setFieldValue(fieldValues.name, fileArray, true);
																} else if (e?.target?.files.length === 1) {
																	console.log(e?.target?.files);
																	const file =  await uploadFile({file: e.target.files[0], filename: field.name});
																	console.log(file);
																	
																	fileArray.push(file);
																	setFieldValue(fieldValues.name, file, true);
																}
															}
														}}
														// value={fieldValues.value.file || ''}
														key={fieldValues.name}
														accept={field.accept}
														multiple={field.multiple}
													/>
													{!fieldValues.value && !getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
														<div className={styles.warning_message}>{getFieldMeta(field.name).error}</div>
														: 
														null
													}
													{getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
														<div className={styles.error_message}>{getFieldMeta(field.name).error}</div>
														: 
														null
													}
												</div>
											);
										}}
									</FastField>
								</Fragment>
							}
							{(field.type === 'editor') &&
									<div style={{width: '100%'}} key={field.name}>
										<FastField name={field.name}>
											{({
												field: fieldValues // { name, value, onChange, onBlur }
												// form: { touched, errors },  also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
												// meta
											}: FastFieldProps) => (
												<Editor
													onChange={(value: string) => setFieldValue(fieldValues.name, value, true)}
													value={fieldValues.value}
													key={fieldValues.name}
												/>
											)}
										</FastField>
										
									</div>
							}
							{field.type === 'toggle' &&
								<>
									<Field name={field.name} key={field.name}>
										{({
											field: fieldValues 
										}: FieldProps) => (
											<SelectToggle
												value={fieldValues.value} 
												valueChangeHandler={(value: boolean) => setFieldValue(field.name, value, true)}
												disabled={fieldDisabledHandler(field)}
												labelBefore={false}
											/>
										)}
									</Field>
								</>
							}
							{field.type === 'color' &&
								<>
								
									<Field name={field.name} key={field.name}>
										{({
											field: fieldValues 
										}: FieldProps) => (
											<ColorPicker
												color={fieldValues.value} 
												valueChangeHandler={(value: string) => setFieldValue(field.name, value, true)}
												disabled={fieldDisabledHandler(field)}
											/>
										)}
									</Field>
								</>
							}
							{(field.type === 'date') &&
								<>
									<DatePicker 
										onChange={(value: Date) => setFieldValue(field.name, value, true)}
										value={values[field.name]}
										key={field.name}
										labelBefore={labelBefore}
									/>
								</>
							}
							{(field.type === 'select') && 
								<SelectField
									key={field.name}
									field={field}
									getFieldMeta={getFieldMeta}
									getSelectValue={getSelectValue}
									values={get( values, field.name, undefined )}
									setFieldValue={setFieldValue}
									disabled={fieldDisabledHandler(field)}
									
								/>	
							}
							{(field.type === 'pointerselect') && 
								<PointerSelectField
									key={field.name}
									field={field}
									getFieldMeta={getFieldMeta}
									values={values}
									setFieldValue={setFieldValue}
									
								/>	
							}
							{(field.type === 'create_options') && 
								<CreateOptions
									key={field.name}
									field={field}
									values={values}
									setFieldValue={setFieldValue}
								/>	
							}
							{/* {(field.type === 'slider') && 
								<Slider 
									field={field}
									values={values}
									setFieldValue={setFieldValue}
									getFieldMeta={getFieldMeta}
									key={field.name}
								/>
							} */}
							{(field.type === 'time_input') && 
								<TimeInputField 
									label={field.label}
									field={field}
									name={field.name}
									key={field.name}
									disabled={fieldDisabledHandler(field)}
								/>
							}
							{(field.type === 'time') && 
								<input 
									type='time'
									// label={field.label}
									defaultValue={values[field.name]}
									name={field.name}
									key={field.name}
									onChange={e => handleChange(e)}
								/>
							}
							{(field.type === 'scale') && 
								<Field 
									name={field.name} 
								>
									{({
										field: fieldValues // { name, value, onChange, onBlur }
									// form: { touched, errors },  also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
									// meta
									}: FieldProps) => (
										<Scale
											field={field}
											setFieldValue={setFieldValue}
											values={values}

										/>
									)}
								</Field>
							}
							
							{(field.type === 'select_and_scale') && 
								<Field name={field.name}>
									{({
										field: fieldValues
									// form: { touched, errors },  also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
									// meta
									}: FieldProps) => (
										<SelectAndScale
											field={field}
											value={fieldValues.value}
											setFieldValue={setFieldValue}
										/>
									)}
								</Field>
							}
							{getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
								<div className={styles.error_message}>{getFieldMeta(field.name).error}</div>
								: 
								null
							}
							{field.description && 
								
							<div className={styles.description_container}>
								{typeof field.description === 'string' ?
									<p>
										{field.description}
									</p>
									:
									field.description
								}
							</div>
							}
								
						</div>
					</Fragment>
				)}
			</div>
		</>
	);
};

export default RenderFields;
