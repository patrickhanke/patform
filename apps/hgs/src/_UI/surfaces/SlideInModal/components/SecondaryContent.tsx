import React from 'react';
import { motion } from 'framer-motion';
import styles from '../SlideInModal.module.scss';

const SecondaryContent = ({isOpen, children}: {isOpen: boolean, children: React.ReactNode}) => {
	return (isOpen && 
		<motion.div
			animate={ { width: isOpen ? 420 : 0 }}
			transition={{ duration: .3, ease: 'easeOut' }}
			className={styles.slidein_secondary_content}
			data-open={isOpen ? true : false}
			style={{overflow: 'hidden'}}
		>
			{children}
		</motion.div>
	);
};

export default SecondaryContent;