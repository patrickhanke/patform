import settings from '@clientSettings';
import styled from '@emotion/styled';

export const tableContainer = {
	marginTop: settings.sizes.large
};

export const table = {
	verticalAlign: 'middle',
	'th': {
		backgroundColor: settings.colors.light,
		borderTop: `1px solid ${settings.colors.darkgrey}`,
		borderBottom: `1px solid ${settings.colors.darkgrey}`,
		borderLeft: `1px solid ${settings.colors.darkgrey}`,
		borderRight: `1px solid ${settings.colors.darkgrey}`,
		minHeight: '50px',
		padding: '10px 0',
		marginBottom: '12px',
		paddingLeft: '0.4rem',
		paddingRight: '0.4rem',
		paddingTop: '0.4rem',
		paddingBottom: 'calc(0.4rem - 1px)'
	}
};

export const ArrowContainer = styled.div({
	fontSize: settings.fontSize.large,
	position: 'relative',
	height: '10px'
},
props => ({color: props.isSortedDesc ? settings.colors.grey : settings.colors.dark})
);


export const arrowIcon = {
	position: 'absolute', 
	top: '50%', 
	left: '50%', 
	transform: 'translate(-50%, -50%)'
};
