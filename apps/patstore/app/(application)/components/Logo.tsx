"use client";

import { getImageUrl } from "@repo/provider";
import Image from "next/image";
import React from "react";
import { patstoreLogo } from "@repo/assets";

const Logo = ({ logo, alt = "patwork" }: { logo: {name: string, url: string}; alt?: string }) => {
  return logo ? (
    <Image
      src={getImageUrl({ fileName: logo.name, width: 60, height: 60 })}
      width={21}
      height={21}
      alt={alt}
    />
  ) : (
    <Image src={patstoreLogo} width={21} height={21} alt={alt} />
  );
};

export default Logo;
