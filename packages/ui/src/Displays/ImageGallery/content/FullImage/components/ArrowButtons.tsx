import React from 'react';

import IconButton from '@components/buttons/IconButton';
import FlexBox from '@components/layout/FlexBox';
import useGetColors from '@hooks/useGetSiteColors';
import {motion} from 'framer-motion';
import PropTypes from 'prop-types';
import {HiArrowLongLeft, HiArrowLongRight} from 'react-icons/hi2';
import { MdArrowDropUp } from 'react-icons/md';

import { arrow, arrowContainer } from '../styles';

const ArrowButtons = ({buttonHandler, imagesArrayLength, contentContainerOpen, setContentContainerOpen, imageIndex}) => {
	const {secondary, secondaryShaded} = useGetColors();
	
	const iconContent = type => {
		if (type === 'left') {
			return <HiArrowLongLeft />;
		}
		if (type === 'right') {
			return <HiArrowLongRight />;
		}
		return null;
	};

	return (
		<FlexBox justify='space-between'align='center'>
			<IconButton
				text='Previous Picture'
				icon={iconContent('left')}
				iconPosition='left'
				isDisabled={imageIndex === 0}
				onClick={() => buttonHandler('left')}
				hoverColor={secondary}
			/>
			<motion.div
				css={[arrowContainer, {backgroundColor: secondary, ':hover':{
					backgroundColor: secondaryShaded
				}}]}
				animate={{rotate: contentContainerOpen ? -180 : 0}}
				onClick={() => setContentContainerOpen(!contentContainerOpen)}
				transition={{
					rotate: {
						duration: .2,
						ease: 'easeIn'
					}
				}}
			>
				<MdArrowDropUp css={arrow} />
			</motion.div>
			<IconButton
				text='Next Picture'
				icon={iconContent('right') }
				onClick={() => buttonHandler('right')}
				isDisabled={imageIndex === (imagesArrayLength-1)}
				hoverColor={secondary}
			/>
		</FlexBox>
	);
};

ArrowButtons.propTypes = {
	buttonHandler: PropTypes.func.isRequired,
	imagesArrayLength: PropTypes.number,
	imageIndex: PropTypes.number,
	contentContainerOpen: PropTypes.bool,
	setContentContainerOpen: PropTypes.func.isRequired
};

ArrowButtons.defaultProps = {
	imagesArrayLength: 0,
	imageIndex: 0,
	contentContainerOpen: false
};

export default ArrowButtons;