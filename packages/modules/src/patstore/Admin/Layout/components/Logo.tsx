"use client";

import Image from "next/image";
import React from "react";
import { patstoreLogo } from "@repo/assets";

const Logo = () => {
	return <Image src={patstoreLogo} width={21} height={21} alt="Hausmeister App" />;
};

export default Logo;
