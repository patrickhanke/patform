'use client';

import Image from 'next/image';
import React from 'react';
import logo from '../images/patwork_logo.png';

const Logo = () => {
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