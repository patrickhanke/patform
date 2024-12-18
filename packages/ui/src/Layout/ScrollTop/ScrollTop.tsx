'use client';

import styles from './ScrollTop.module.scss';
import {motion} from 'motion/react';
import { Icon } from '@repo/ui';

const ScrollTop = ({show}: {show: boolean}) => {
	return (
		<motion.div
			className={styles.scrolltop_container}
			animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0 }}
			onClick={() =>  {
				const doc = document.getElementById('page_content');
				if (doc) {
					doc.scrollTo({ top: 0, behavior: 'smooth' });
				}
			}}
		>
			<Icon
				type='arrow-up'
				size={18}
				strokeWidth={1.8}
				color={'white'}
			/>
		</motion.div>
	);
};

export default ScrollTop;