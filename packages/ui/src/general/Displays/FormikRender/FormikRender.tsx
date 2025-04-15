"use client";

import * as Yup from "yup";
import { Formik } from "formik";
import FormSubmitStore from "./components/FormSubmitStore";
import RenderFields from "./content/RenderFields";
import "./styles.scss";
import { FormikRenderProps } from "./types";
import createYupSchema from "./functions/createYupSchema";
import getFieldsWithValidation from "./functions/getFieldsWithValidation";
import { FC } from "react";

const FormikRender: FC<FormikRenderProps> = ({
	fields,
	data,
	apiClass,
	id,
	afterSaveFunction,
	formSubmitHandler,
	formValidationHandler,
	useWithDebounce,
	isHorizontal = false,
	setSecondaryContent,
	highlightChanges = false
}) => {
	return (
		<Formik
			initialValues={
				data
					? data
					: Object.fromEntries(
							fields.map((field) => [
								field.name,
								field.initialValue
							])
						)
			}
			onSubmit={(values) => {
				console.log(values);

				if (formSubmitHandler) {
					formSubmitHandler(values);
				}
			}}
			validationSchema={Yup.object().shape(
				Object.fromEntries(
					getFieldsWithValidation(fields).map((field) => [
						field.name,
						createYupSchema(field.type, field.validation)
					])
				)
			)}
			validateOnMount
			enableReinitialize
		>
			{({
				handleSubmit,
				handleBlur,
				values,
				handleChange,
				setFieldValue,
				getFieldMeta
			}) => (
				<form onSubmit={handleSubmit} className="form_container">
					<RenderFields
						fields={fields}
						getFieldMeta={getFieldMeta}
						handleBlur={handleBlur}
						values={values}
						apiClass={apiClass}
						id={id}
						afterSaveFunction={afterSaveFunction}
						setFieldValue={setFieldValue}
						handleChange={handleChange}
						isHorizontal={isHorizontal}
						setSecondaryContent={setSecondaryContent}
						highlightChanges={highlightChanges}
					/>
					<FormSubmitStore
						formValidationHandler={formValidationHandler}
						useWithDebounce={useWithDebounce}
						submitForm={handleSubmit}
					/>
				</form>
			)}
		</Formik>
	);
};

export default FormikRender;
