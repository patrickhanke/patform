import { Select } from '@repo/ui';
import { TableColumnEditStateProps } from '../types';
import { isArray } from 'lodash';

const TableColumnEditState = ({value, isEditable, onChange, options = []}: TableColumnEditStateProps) => {
	return (
		<div>
			{isEditable ? 
				<Select
					options={options}
					value={value}
					onChange={onChange}
					isDisabled={!isEditable}
				/>
				:
				<div>
					{isArray(options) && options.find(option => option.value === value)?.label}
				</div>
			}
		</div>
	);
};

export default TableColumnEditState;