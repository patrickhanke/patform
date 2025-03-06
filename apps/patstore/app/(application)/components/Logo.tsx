'use client';

import Image from 'next/image';
import React from 'react';

const Logo = ({logo} : {logo: string}) => {
	return (
		<Image
			src={logo}
			width={21}
			height={21}
			alt="Hausmeister App"
		/>
	);
};

export default Logo;