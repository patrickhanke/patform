import React from "react";

const SlideInWrapper = ({ children }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const clonedChildren = React.Children.map(children, (child) =>
		React.isValidElement(child)
			? React.cloneElement(child, { isOpen, setIsOpen })
			: child
	);

	if (isOpen) {
		return <div className="slide_in_wrapper">{clonedChildren}</div>;
	}

	return <button onClick={() => setIsOpen(true)} className="slide_in_button">Open Slide In</button>;
};

export default SlideInWrapper;
