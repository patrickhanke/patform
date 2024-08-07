'use client';

import Image from 'next/image';
import React from 'react';

const Logo = ({logo} : {logo: {name: string, url: string}}) => {
	if (logo?.url) {
		return (
			<Image
				src={logo.url}
				width={18}
				height={18}
				alt="Hausmeister App"
			/>
		);
	}

	return null;
};

export default Logo;