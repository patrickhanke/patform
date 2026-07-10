"use client";

import * as Yup from "yup";
import { Formik, FormikErrors, FormikProps, FormikValues } from "formik";
import RenderFields from "./content/RenderFields";
import "./styles.scss";
import { FormikRenderSlideInProps } from "./types";
import createYupSchema from "./functions/createYupSchema";
import getFieldsWithValidation from "./functions/getFieldsWithValidation";
import { FC, useEffect, useRef, useState } from "react";
import { Divider, SlideIn } from "@repo/ui";
import { ErrorMessage } from "@repo/types";
import SlideInFormSubmitStore from "./components/SlideInFormSubmitStore";

const FormikRenderSlideIn: FC<FormikRenderSlideInProps> = ({
	isOpen,
	setIsOpen,
	title,
	dataHandler,
	fields,
	data,
	apiClass,
	id,
	isHorizontal = false,
	highlightChanges = false
}) => {
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [isValid, setIsValid] = useState<boolean>(false);
	const [secondaryContent, setSecondaryContent] =
		useState<React.ReactNode | null>(null);
	const [loading, setLoading] = useState(false);

	const ref = useRef<FormikProps<FormikValues>>(null);

	useEffect(() => {
		if (setSecondaryContent) {
			setSecondaryContent(null);
		}
	}, []);

	return (
		<SlideIn
			errors={errors}
			isOpen={isOpen}
			header={title}
			cancel={() => {
				if (ref.current?.resetForm) {
					ref.current.resetForm();
				}
				setSecondaryContent(null);
				setIsOpen(false);
			}}
			confirm={async () => {
				setLoading(true);
				const currentValues = ref.current?.values || data;
				if (currentValues) {
					await dataHandler(currentValues);
				}
				ref.current?.submitForm();
				if (ref.current?.resetForm) {
					ref.current.resetForm();
				}
				setSecondaryContent(null);
				setLoading(false);
				setIsOpen(false);
			}}
			disabled={[false, !isValid]}
			secondaryContent={secondaryContent}
			showSecondaryContent={secondaryContent ? true : false}
			loading={loading}
		>
			<Formik
				innerRef={ref}
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
				onSubmit={async () => {
					console.log("submit");
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
							setFieldValue={setFieldValue}
							handleChange={handleChange}
							isHorizontal={isHorizontal}
							setSecondaryContent={setSecondaryContent}
							highlightChanges={highlightChanges}
						/>
						<Divider showLine={false} />
						<SlideInFormSubmitStore
							formValidationHandler={(value) => setIsValid(value)}
							setErrors={(
								formikErrors: FormikErrors<FormikValues>
							) => {
								const errorArray: ErrorMessage[] = [];
								if (formikErrors) {
									Object.keys(formikErrors).forEach((key) => {
										errorArray.push({
											id: key,
											key,
											message: `${key}: ${formikErrors[key]}`
										});
									});
								}
								setErrors(errorArray);
							}}
						/>
						<h6>* Pflichtfeld</h6>
						{/* <button type="submit">Submit</button> */}
					</form>
				)}
			</Formik>
		</SlideIn>
	);
};

export default FormikRenderSlideIn;
