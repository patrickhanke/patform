"use client";

import Image from "next/image";
import patstoreLogo from "../images/patstore_logo.png";

const Logo = () => {
	return (
		<Image
			src={patstoreLogo}
			width={21}
			height={21}
			alt="Hausmeister App"
		/>
	);
};

export default Logo;
