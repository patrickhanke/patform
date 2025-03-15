'use client';

import Image from 'next/image';
import React from 'react';
import logo from '../images/logo_3_font.png';

const Logo = () => {
    return (
        <div className={'sidebar_header_content'}>
            <Image
                src={logo}
                // width={135}
                style={{ borderRadius: '0px' }}
                height={21}
                alt="Hausmeister App"
            />
            <div className="sidebar_label">
                <h1>patflow</h1>
            </div>
        </div>
    );
};

export default Logo;
