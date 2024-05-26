import settings from '@clientSettings';
import PropTypes from 'prop-types';

import React from 'react';

const GlobalFilter = ({globalFilter, setFilter}) => {
	const [value, setValue] = React.useState(globalFilter);

	return (
		<div css={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap:settings.sizes.medium }} >
			Suche: {' '}
			<input 
				value={value || ''}
				onChange={e => {
					setValue(e.target.value);
					setFilter(e.target.value);
			  }}
				css={{
					padding: settings.padding.tiny,
					color: settings.colors.dark,
					border: `1px solid ${settings.colors.grey}`,
					height: 'auto',
					width: '200px',
					fontSize: settings.fontSize.medium,
					lineHeight: 1,
					outline: '0px',
					transition: 'border 0.4s ease',
					':focus-visible': {
						border: `1px solid ${settings.colors.primary}`
					}
				}}

			/>
		</div>
	);
};

GlobalFilter.propTypes = {
	globalFilter: PropTypes.string,
	setFilter: PropTypes.func.isRequired
};

GlobalFilter.defaultProps = {
	globalFilter: ''
};


export default GlobalFilter;