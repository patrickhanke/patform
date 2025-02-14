import settings from '@settings';

export const imagesContainer = settings.mq({
	display: 'flex',
	flexDirection: ['row', 'row', 'row'],
	alignItems: 'center',
	gap: settings.sizes.medium,
	width: '100%',
	flexWrap: 'wrap'
});

export const imageContainer = settings.mq({
	cursor: 'pointer', 
	position: 'relative',
	overflow: 'visible',
	flex: ['1 1 48%', '1 1 48%', '1 1 31%', '1 1 24%'],
	backgroundColor: 'transparent',
	minWidth: ['48%', '48%', '31%', '24%'],
	'img': {
		backgroundColor: 'transparent',
		transition: 'box-shadow 0.4s ease',
		objectFit: 'cover',
		':hover': {boxShadow: settings.shadows.hover}
	}
});

export const filterContainer = {
	backgroundColor: settings.colors.white, 
	border: `1px solid ${settings.colors.grey}`,
	padding: settings.padding.medium, 
	marginBottom: settings.sizes.large,
	zIndex: 5
};

export const paginationContainer = {
	position: 'sticky', 
	zIndex: 8, 
	bottom: 0, 
	backgroundColor: settings.colors.light, 
	padding: settings.padding.small
};

