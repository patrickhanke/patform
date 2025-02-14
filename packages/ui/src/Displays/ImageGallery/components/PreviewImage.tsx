
import React, { useState } from 'react';

import axios from 'axios';
import {motion} from 'framer-motion';
import PropTypes from 'prop-types';

import { imageVariant } from '../animations';
import { imageContainer } from '../styles';

const PreviewImage = ({imageFile, setShowFullImage}) => {
	const [isLoaded, setIsLoaded] = useState(false);
	axios.get(imageFile?.preview?.full ).then(() => setIsLoaded(true));

	console.log(imageFile);
	return (
		<motion.div 
			key={imageFile?.image?.uuid}
			variants={imageVariant}
			onClick={() => setShowFullImage(imageFile.index)}
			css={imageContainer}
		>
			<img 
				loading="lazy"
				alt={imageFile.title ? imageFile.title : imageFile.event_title}  
				src={isLoaded ? imageFile.preview.full : imageFile.preview.blur}
			/>
		</motion.div>
	);
};

PreviewImage.propTypes = {
	setShowFullImage: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired,
	imageFile: PropTypes.object.isRequired 
};

export default PreviewImage;