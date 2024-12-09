'use client';

import { useRef } from 'react';
import styles from './SlideInModal.module.scss';

import { useOnClickOutside } from 'usehooks-ts';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideInComponent } from './types';
import { IconButton } from '@/_UI/interfaces';
import variants from './constants/variants';
import ErrorDisplay from '../ErrorDisplay';

const SlideInModal = ({
	header, 
	preventClickOutside=false, 
	children,
	isOpen,
	cancel,
	confirm,
	confirmText,
	secondaryContent= null,
	disabled = [false, false],
	errors = []
}: SlideInComponent) => {
	const ref = useRef(null);
	useOnClickOutside(ref, () => {
		if (preventClickOutside === true) return;
		close();
	});

	return (
		<>
			<div className={styles.overlay_container} data-isopen={isOpen} />
			<AnimatePresence initial={true}>
				{isOpen && (
					<motion.div
						variants={variants}
						initial={'initial'}
						animate={'animate'}
						exit={'exit'}
						ref={ref} 
						transition={{ duration: .3, ease: 'easeOut' }}
						className={styles.slidein_container}
					>
						<div className={styles.slidein_header} >
							<h3>{header}</h3>
							<IconButton
								icon='close'
								onClick={() => cancel()}
								noBorder
								size={18}
							/>
						</div>
						<div className={styles.slidein_main_content}>
							<div className={styles.slidein_content}>
								{children}
								<ErrorDisplay errors={errors} />
							</div>
							
							<motion.div
								animate={ { width: secondaryContent ? 420 : 0 }}
								transition={{ duration: .3, ease: 'easeOut' }}
								className={styles.slidein_secondary_content}
								data-open={secondaryContent ? true : false}
							>
								{secondaryContent}
							</motion.div>
						</div>
						<div className={styles.slidein_footer}>
							<div className="button_container">
								<button className='full_button md light' disabled={disabled[0]} onClick={() => cancel()}>Abbrechen</button>
								<button className='full_button md green' disabled={disabled[1]} onClick={() => confirm()}>{confirmText ? confirmText : 'Speichern'}</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default SlideInModal;