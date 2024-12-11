'use client';

import Image from 'next/image';
import React from 'react';
import logo from  '../images/logo_hgs_wide.png';

const Logo = () => {
	return (
		<Image
			src={logo}
			// width={135}
			height={21}
			alt="Hausmeister App"
		/>
	);
};

export default Logo;