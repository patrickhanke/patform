import { TableColumnPersonProps } from '../types';
import {PersonDisplay} from '@repo/ui';
import { useContext, useMemo } from 'react';
import ReactSelect, {components} from 'react-select';
import { StylesConfig, SingleValue } from 'react-select';
import { AppContext, generateGraphQLQuery } from '@repo/provider';
import { useQuery } from '@apollo/client';
import { PersonClass } from '@repo/types';

type PersonOption = { value: string, label: string, person: PersonClass }

const TableColumnPerson = ({value, isEditable, onChange}: TableColumnPersonProps) => {
	const {modules} = useContext(AppContext);
	const {data: personData} = useQuery(generateGraphQLQuery({type: 'find', objectName: 'Person', fields: ['objectId', 'label', 'portrait']}), {variables: {params: {module: {_eq:  modules.find(module => module.path === '/persons')?.objectId}}}});

	const customComponent = useMemo(() => {
		return ({
			Option: (props: any) => {
				return (
					<components.Option {...props}>
						{props.data.person ?
							<PersonDisplay person={props.data.person} />
							:
							props.data.label
						}
					</components.Option>
				);
			},
			SingleValue: (props: any) => {
				return (
					<components.SingleValue {...props}>
						{props.data.person ?
							<PersonDisplay person={props.data.person} />
							:
							props.data.label
						}
					</components.SingleValue>
				);
			}
		});

	}, []);

	const options: PersonOption[] = useMemo(() => {
		const personOptions: PersonOption[] = [];
		if (personData) {
			personData.objects.findPerson.results.forEach((person: PersonClass) => {
				personOptions.push({value: person.objectId, label: person.label, person});
			});
		}
		return personOptions;
	}, [personData]);

	return (
		<div>
			{isEditable ? 
				<ReactSelect
					value={options.find(option => option.value === value.objectId)}
					onChange={(inputValue) => onChange(inputValue.value as string) }
					options={options}
					isMulti={false}
					// isDisabled={isDisabled}
					// isClearable={isClearable}
					className={'react_select_container'}
					classNamePrefix="react-select"
					styles={customStyles({width: 200})}
					menuPosition="fixed"
					menuPlacement="auto"	
					components={customComponent}
				/>
				:
				<div>
					<PersonDisplay person={value|| null} />
				</div>
			}
		</div>
	);
};

const customStyles = ({width}: {width: string | number}): StylesConfig => ({
	control: (provided: Record<string, unknown>, state: any) => ({
		...provided,
		minHeight: 0,
		border: state.isFocused ? '1px solid #3F9A82' : '1px solid #99999',
		outline: 'none',
		boxShadow: 'none',
		// "&": {
		//   border: "1px solid #cccccc",
		//   boxShadow: "none"
		// },
		'&:hover': {
			border: '1px solid #3F9A82'
		},
		width
	}),
	container: provided => ({
		...provided,
		position: 'relative',
		minWidth: '120px'
	}),
	clearIndicator: provided => ({
		...provided,
		padding: '4px'
	}),

	menu: provided => ({ 
		...provided, 
		zIndex: 9999,
		fontFamily: 'Roboto',
		fontWeight: 400,
		fontSize: '12px'
	}),
	singleValue: provided => ({
		...provided,
		fontFamily: 'Roboto',
		fontWeight: 400,
		fontSize: '12px'
	}),	
	multiValueLabel: provided => ({
		...provided,
		fontFamily: 'Roboto',
		fontWeight: 400,
		fontSize: '12px'
	})	,
	dropdownIndicator: provided => ({
		...provided,
		padding: '4px'
	}),
	placeholder: provided => ({ 
		...provided,
		fontFamily: 'Roboto',
		color: '#999999'
	}),
	input: provided => ({
		...provided,
		margin: 0
	})	
});


export default TableColumnPerson;