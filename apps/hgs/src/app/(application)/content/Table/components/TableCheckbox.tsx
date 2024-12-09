import React, { HTMLProps } from 'react';

const TableCheckbox = ({
	indeterminate,
	className = '',
	checked = false,
	onChange,
	disabled = false

}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
	const ref = React.useRef<HTMLInputElement>(null!);
  
	React.useEffect(() => {
		if (typeof indeterminate === 'boolean') {
			ref.current.indeterminate = checked && indeterminate;
		}
	}, [ref, indeterminate]);
  
	return (
		<input
			type="checkbox"
			ref={ref}
			className={className + ' cursor-pointer'}
			onChange={onChange}
			checked={checked}
			disabled={disabled}
		/>
	);
};

export default TableCheckbox;