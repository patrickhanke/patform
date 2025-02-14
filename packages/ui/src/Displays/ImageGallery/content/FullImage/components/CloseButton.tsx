import React from 'react';
import {TfiClose} from 'react-icons/tfi';
import {motion } from 'framer-motion';
import PropTypes from 'prop-types';
import settings from '@settings';
import useGetColors from '@hooks/useGetSiteColors';
import { arrow } from '../styles';

const CloseButton = ({onClick}) => {
	const {secondary, secondaryShaded} = useGetColors();
	
	return (
		<motion.div
			css={{
				position: 'fixed',
				top: 30,
				right: 30,
				width: 36,
				height: 36,
				backgroundColor: secondary,
				padding: settings.sizes.medium,
				borderRadius: '50%',
				cursor: 'pointer',
				zIndex: 12,
				transition: 'background-color .4s ease',
				':hover':{
					backgroundColor: secondaryShaded
				}
			}}
			onClick={() => onClick()}
		>
			<TfiClose css={arrow} />
		</motion.div>
	);};

CloseButton.propTypes = {
	onClick: PropTypes.func.isRequired
};

export default CloseButton;