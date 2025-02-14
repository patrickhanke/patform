import settings from '@settings';

export const overlay = {
	zIndex: 10,
	top: 0,
	left: 0,
	position:'fixed', 
	width: '100vw', 
	height: '100%', 
	backgroundColor: 'rgba(0,0,0,0.7)'
};

export const fullImageContainer = {
	zIndex: 11,
	position: 'fixed',
	maxHeight: '90vh',
	maxWidth: '90vw',
	display: 'flex',
	flexDirection: 'column'
	// backgroundColor: settings.colors.grey
};

export const fullImageContent = {
	padding: settings.padding.medium,
	backgroundColor: settings.colors.light,
	position: 'fixed',
	bottom: 0,
	left: 0,
	width: '100%',
	zIndex: 11	
};

export const contentContainer = {
	overflow: 'hidden', transition: 'height .4s ease'
};

export const headlineContainer = {
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	position: 'relative',
	cursor: 'pointer',
	'h3': {
		marginBottom: '0 !important'
	}
};

export const arrowContainer = {
	position: 'relative',
	width: 30,
	height: 30,
	padding: settings.sizes.medium,
	borderRadius: '50%',
	cursor: 'pointer',
	transition: 'background-color .4s ease'
};
export const arrowContainerNoBackground = {
	position: 'relative',
	width: 30,
	height: 30,
	padding: settings.sizes.medium,
	borderRadius: '50%',
	cursor: 'pointer',
	transition: 'background-color .4s ease',
	color: settings.colors.dark,
	':hover':{
		backgroundColor: settings.colors.grey
	}
};

export const arrow = {
	position: 'absolute', 
	top: '50%', 
	left: '50%', 
	transform: 'translate(-50%, -50%)'
};