'use client';

import Image from 'next/image';
import React from 'react';
import someLogo from  '../images/logo_hgs_wide.png';

const Logo = ({logo} : {logo?: {name: string, url: string}}) => {
	return (
		<Image
			src={logo ? logo.url : someLogo}
			width={21}
			height={21}
			alt="Hausmeister App"
		/>
	);
};

export default Logo;