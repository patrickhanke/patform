import { StylesConfig } from 'react-select';

const customStyles = ({width}: {width: string | number}): StylesConfig => ({
	control: (provided: Record<string, unknown>, state: any) => ({
		...provided,
		minHeight: 0,
		// border: state.isFocused ? '1px solid #3F9A82' : '1px solid #99999',
		outline: 'none',
		boxShadow: 'none',
		border: 'none',
		// "&": {
		//   border: "1px solid #cccccc",
		//   boxShadow: "none"
		// },
		'&:hover': {
			// border: '1px solid #3F9A82',
			border: 'none'
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
	menuPortal: provided => ({
		...provided,
		zIndex: 9999
	}),
	menu: provided => ({ 
		...provided, 
		zIndex: 9999,
		fontFamily: 'Geist',
		fontWeight: 400,
		fontSize: '12px'
	}),
	singleValue: provided => ({
		...provided,
		fontFamily: 'Geist',
		fontWeight: 400,
		fontSize: '12px'
	}),	
	multiValueLabel: provided => ({
		...provided,
		fontFamily: 'Geist',
		fontWeight: 400,
		fontSize: '12px'
	})	,
	dropdownIndicator: provided => ({
		...provided,
		padding: '4px'
	}),
	placeholder: provided => ({ 
		...provided,
		fontFamily: 'Geist',
		color: '#999999'
	}),
	input: provided => ({
		...provided,
		margin: 0
	})	
});

export default customStyles;