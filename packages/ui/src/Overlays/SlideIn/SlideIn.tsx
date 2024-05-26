'use client';

import { useRef } from 'react';
import './styles.scss';
import clsx from 'clsx';

import { useOnClickOutside } from 'usehooks-ts';
import { SlideInComponent } from './types';

const SlideIn = ({children, header, isOpen, setIsOpen, preventClickOutside, size = 'small' }: SlideInComponent) => {
	const ref = useRef(null);
	useOnClickOutside(ref, () => {
		if (preventClickOutside === true) return;
		setIsOpen(false);
	});

	return (
		<>
			<div className={'overlay_container'} data-isopen={isOpen} />
			<div 
				ref={ref} 
				className={clsx('slidein_container', isOpen === true && 'is_open')}
				data-size={size}
			>
				{isOpen && 
					<>
						<div className={'slidein_header'} >
							<h3>{header}</h3>
						</div>
						<div className={'slidein_content'}>
							{children}
						</div>
					</>
				}
			</div>
		</>
	);
};

export default SlideIn;