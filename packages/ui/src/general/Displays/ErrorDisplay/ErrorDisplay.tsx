import { useMemo } from "react";
import { ErrorMessage } from "@repo/types";
import "./styles.scss";

const ErrorDisplay = ({
	id,
	errors
}: {
	id?: string;
	errors?: ErrorMessage[];
}) => {
	const errorMessages = useMemo(() => {
		const errorArray: ErrorMessage[] = [];
		if (id) {
			errors?.forEach((error) => {
				if (error.id === id) {
					errorArray.push(error);
				}
			});
		} else {
			errors?.forEach((error) => {
				errorArray.push(error);
			});
		}
		return errorArray;
	}, [errors]);

	if (errors && errors.length > 0 && errorMessages.length > 0) {
		return (
			<ul className="error_display_container">
				{errorMessages.map((error) => (
					<li key={error.key} className={"error_display_message"}>
						{error.message}
					</li>
				))}
			</ul>
		);
	}
	return null;
};

export default ErrorDisplay;
