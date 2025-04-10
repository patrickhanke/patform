import React from "react";
import SlideIn from "./SlideIn";

const SlideInWrapper = ({ children }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	return (
		<SlideIn
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			loading={loading}
			setLoading={setLoading}
			header={"Beschreibung ändern"}
			cancelButtonHandler={() => setIsOpen(false)}
			confirmButtonHandler={() => {
				setIsOpen(false);
				setLoading(false);
			}}
			buttonDisabled={[loading, loading]}
		></SlideIn>
	);
};

export default SlideInWrapper;
