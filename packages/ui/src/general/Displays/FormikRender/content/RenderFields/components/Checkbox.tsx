import React from "react";

const Checkbox = ({
	value,
	onChange
}: {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	return (
		<div>
			<input type="checkbox" value={value} onChange={onChange} />
			<label>{value}</label>
		</div>
	);
};

export default Checkbox;
