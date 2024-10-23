import { Select } from '@repo/ui';
import { TableColumnPersonProps } from '../types';
import {PersonDisplay} from '@repo/ui';

const TableColumnPerson = ({value, isEditable, onChange, options = []}: TableColumnPersonProps) => {
	console.log(value);
	
	
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
					<PersonDisplay person={value} />
				</div>
			}
		</div>
	);
};

export default TableColumnPerson;