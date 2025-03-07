'use client';

import React from 'react';

const Logo = ({logo} : {logo: string}) => {
	return (
		<img
			src={logo}
			width={21}
			height={21}
			alt="Hausmeister App"
		/>
	);
};

export default Logo;