import React from 'react';

const ImagePreview = ({image}: {image?: {name: string, url: string}}) => {
	if (image) {
		return (
			<div>
				<img src={image.url} alt={image.name} height={50} />
			</div>
		);
	}
	return null;
};

export default ImagePreview;