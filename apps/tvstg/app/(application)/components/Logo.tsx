'use client';

import Image from 'next/image';
import React from 'react';

const Logo = ({logo} : {logo: {name: string, url: string}}) => {
	return (
		<Image
			src={logo.url}
			width={21}
			height={21}
			alt="Hausmeister App"
		/>
	);
};

export default Logo;