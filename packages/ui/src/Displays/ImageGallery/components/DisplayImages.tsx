import React from 'react';

import {motion} from 'framer-motion';
import PropTypes from 'prop-types';

import PreviewImage from './PreviewImage';
import { imageContainerVariant } from '../animations';
import { imagesContainer } from '../styles';

const DisplayImages = ({images, setShowFullImage}) => (
	<motion.div
		variants={imageContainerVariant}
		initial="hidden"
		animate="show"
		css={[imagesContainer, { justifyContent: images.length < 4 ? 'center' : 'space-between'}]}
	>
		{images.length === 0 ?
			<p>Für diese Auswahl gibt es keine Bilder</p>
			:
			images.map((imageFile, index) => {
				if (imageFile?.image?.uuid ) return (
					<PreviewImage
						key={imageFile?.image?.uuid}
						imageFile={imageFile}
						setShowFullImage={setShowFullImage}
						index={index}
					/>
				);
				return null;
			})}
	</motion.div>
);

DisplayImages.propTypes = {
	images: PropTypes.array,
	setShowFullImage: PropTypes.func.isRequired
};

DisplayImages.defaultProps = {
	images: []
};

export default DisplayImages;