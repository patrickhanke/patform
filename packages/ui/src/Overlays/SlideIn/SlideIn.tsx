'use client';

import { useRef } from 'react';
import './styles.scss';

import { useOnClickOutside } from 'usehooks-ts';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideInComponent } from './types';
import { IconButton } from '../../Buttons';

const SlideIn = ({
	header, 
	preventClickOutside=false, 
	children,
	isOpen,
	close,
	secondaryContent= null
}: SlideInComponent) => {

	const ref = useRef(null);
	useOnClickOutside(ref, () => {
		if (preventClickOutside === true) return;
		close();
	});

	return (
		<>
			<div className={'overlay_container'} data-isopen={isOpen} />
			<AnimatePresence initial={true}>
				{isOpen && (
					<motion.div
						initial={{ right: -300}}
						animate={{ right: 120 }}
						exit={{ right: -300 }}
						ref={ref} 
						transition={{ duration: .3, ease: 'easeOut' }}
						className={'slidein_container'}
					>
						<div className={'slidein_header'} >
							<h3>{header}</h3>
							<IconButton
								icon='cancel'
								onClick={() => close()}
							/>
						</div>
						<div className="slidein_main_content">
							<div className={'slidein_content'}>
								{children}
							</div>
							
							<motion.div
								animate={ { width: !!secondaryContent ? 360 : 0 }}
								transition={{ duration: .3, ease: 'easeOut' }}
								className={'slidein_secondary_content'}
								data-open={!!secondaryContent ? true : false}
								
							>
								{secondaryContent}
							</motion.div>
							
						</div>
						<div className='slidein_footer'>
							<div className="button_container">
								<button>Abbrechen</button>
								<button>speichern</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default SlideIn;