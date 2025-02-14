import ReactDOM from 'react-dom';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import settings from '@settings';
import AthletesLabel from '@components/surfaces/AthleteLabel/AthletesLabel';
import Divider from '@components/surfaces/Divider';
import { RiCloseLine } from 'react-icons/ri';
import axios from 'axios';
import { arrow, arrowContainerNoBackground, contentContainer, fullImageContainer, fullImageContent, headlineContainer, overlay } from './styles';
import CloseButton from './components/CloseButton';
import ArrowButtons from './components/ArrowButtons';
import { fullImageVariant } from './animations';

const FullImage = ({initialIndex, setInitialIndex,  currentImages}) => {
	const [isLoaded, setIsLoaded] = useState(false);

	const [imageIndex, setImageIndex] = useState(null);
	const [contentContainerOpen, setContentContainerOpen] = useState(false);
	const [windowSize, setWindowSize] = useState(undefined);
	const [horizontal, setHorizontal] = useState(true);
	
	const [fullImage, setFullImage] = useState();

	useEffect(() => {
		if (imageIndex === null) {
			setImageIndex(initialIndex);
			setFullImage(currentImages[initialIndex]);
		}

	}, [currentImages, initialIndex, imageIndex]);
	

	useEffect(() => {
		let cleanUp = false;
		if (!cleanUp && typeof imageIndex === 'number' && fullImage) {
			axios.get(fullImage.full_image.full ).then(() => {
				setIsLoaded(true);
			});
		}
		return (() => {
			cleanUp = true;
		});
	});

	useEffect(() => {
		setWindowSize({
			height: window.screen.height,
			width: window.screen.width,
			innerHeight: window.innerHeight,
			innerWidth: window.innerWidth
	 });
		window.addEventListener('resize', () => {
			setWindowSize({
				height: window.screen.height,
				width: window.screen.width,
				innerHeight: window.innerHeight,
				innerWidth: window.innerWidth
		 });
		}, true);

		return window.removeEventListener('rezize', () => {}, true );
	}, [setWindowSize]);

	const arrowButtonHandler =  direction => {
		if (direction === 'left') {
			setImageIndex(imageIndex - 1);
			setFullImage(currentImages.find(image => image.index === imageIndex - 1) );
			setIsLoaded(false);
		}
		if (direction === 'right') {
			setImageIndex(imageIndex + 1);
			setFullImage(currentImages.find(image => image.index === imageIndex + 1) );
			setIsLoaded(false);
		}
	};

	// useEffect(() => {
	// 	if (image) {
	// 		const index = currentImages.findIndex(imageInArray => imageInArray.image.uuid === image.image.uuid ); 
	// 		setImageIndex(index);
	// 		  setOpen(true);
	// 	}
	//   }, [image, currentImages]);

	useEffect(() => {
		if (windowSize) {
			if (windowSize.innerWidth < windowSize.innerHeight) {
				setHorizontal(false);
			}
			if (windowSize.innerWidth > windowSize.innerHeight) {
				setHorizontal(true);
			}
		}
	  }, [windowSize]);
	
	const containerSizeHandler = () => {
		let containerWidth = 360;
		let containerHeight = 360;
		if (windowSize) {
			if (!horizontal) {
				containerWidth = windowSize.innerWidth -30;
				containerHeight = (windowSize.innerWidth - 30) * 2 / 3;
				if (windowSize.innerWidth > 640) {
					containerWidth = windowSize.innerWidth -30;
					containerHeight = (windowSize.innerWidth - 30) * 2 / 3;
				} else if (windowSize.innerWidth > 840) {
					containerWidth = windowSize.innerWidth -60;
					containerHeight = (windowSize.innerWidth -60) * 2 / 3;
				} else if (windowSize.innerWidth >= 1200 ) {
					containerWidth = 1170;
					containerHeight = (windowSize.innerWidth -60 ) * 2 / 3;
				}
			}
			if (horizontal) {
				containerHeight = windowSize.innerHeight - 80;
				containerWidth = (windowSize.innerHeight -80) * 1.5;
				if (windowSize.innerHeight > 640) {
					containerHeight = windowSize.innerHeight - 80;
					containerWidth = (windowSize.innerHeight -80) * 1.5;
				} else if (windowSize.innerHeight > 840) {
					containerHeight = windowSize.innerHeight - 100;
					containerWidth = (windowSize.innerHeight - 100) * 1.5;
				} else if (windowSize.innerHeight >= 1200 ) {
					containerHeight = 1170;
					containerWidth = (windowSize.innerHeight - 120) * 1.5;
				}
			}
		}
		return ({
			width: containerWidth,
			height: containerHeight
		});
	};

	const fullImageClosaHandler = () => {
		setImageIndex(null);
		setFullImage(undefined);
		setIsLoaded(false);
		setInitialIndex(null);
	};

	if (typeof window !== 'undefined') {
		return ReactDOM.createPortal(
			<AnimatePresence>
				{imageIndex !== null && fullImage && 
					<>
						<motion.div
							key="slideIn-overlay"
							transition={.4}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							css={overlay}
							onClick={() => fullImageClosaHandler()}
						/>
						<CloseButton onClick={() => fullImageClosaHandler()}/>
						<motion.div
							key="slidein-animation"
							style={{
								width: containerSizeHandler().width,
								height: containerSizeHandler().height ,
								y: '-50%',
								x: '-50%',
								left: '50%'
							}}
							variants={fullImageVariant}
							initial="initial"
							animate="animate"
							exit="exit"
							css={settings.mq(fullImageContainer)}
						>
							{isLoaded ? 
								<img 
									height="100%"
									alt={fullImage.title}  
									src={fullImage.full_image.full}
									css={{objectFit: 'contain'}}
								/>
								:
								<img 
									height="100%"
									alt={fullImage.title}  
									src={fullImage.full_image.blur}
									css={{objectFit: 'contain'}}
								/>

							}
						</motion.div>
						<motion.div 
							css={fullImageContent}
						>
							<div css={{margin: 'auto', maxWidth: '1070px'}}>
								<motion.div
									style={{height: contentContainerOpen ? 100 : 0}}
									css={contentContainer}
									transition={{
										height: {
											duration: .4,
											ease: 'easeIn'
										}
									}}
								>
									<div 
										css={headlineContainer}
										onClick={() => setContentContainerOpen(!contentContainerOpen)}

										aria-hidden='true'
									>
										<motion.h3
											animate={{
												margin: contentContainerOpen ? `0 0 ${settings.sizes.medium} 0` : 0 ,
												fontSize: contentContainerOpen ? settings.fontSize.medium : settings.fontSize.small
											}}
											whileHover={{textDecoration: 'underline'}}
											transition={{
												margin: {
													duration: .2,
													ease: 'easeIn'
												},
												fontSize: {
													duration: .2,
													ease: 'easeIn'
												}
											}}
										>
											{fullImage.title ? `${fullImage.title} - ${fullImage.event_title}` : fullImage.event_title }
										</motion.h3>
										<div
											css={arrowContainerNoBackground}
										>
											<RiCloseLine css={arrow} />
										</div>
									</div>
									<Divider gap='medium' />
									<AthletesLabel athletes={fullImage.athletes} />
								</motion.div>
								<ArrowButtons
									setContentContainerOpen={setContentContainerOpen}
									contentContainerOpen={contentContainerOpen}
									buttonHandler={arrowButtonHandler}
									imagesArrayLength={currentImages.length}
									imageIndex={imageIndex}
								/>
							</div>
						</motion.div>
					</>
				}
			</AnimatePresence>,
			document.body
		); 
	}
	return null;
};

FullImage.propTypes = {
	initialIndex: PropTypes.number,
	setInitialIndex: PropTypes.func.isRequired,
	currentImages: PropTypes.array 
};

FullImage.defaultProps = {
	initialIndex: null,
	currentImages: []
};

export default FullImage;