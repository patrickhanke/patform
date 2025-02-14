import React, { useEffect, useState } from 'react';

import IconButton from '@components/buttons/IconButton';
import useGetColors from '@hooks/useGetSiteColors';
import PropTypes from 'prop-types';
import { HiArrowLongLeft, HiArrowLongRight } from 'react-icons/hi2';
import ReactPaginate from 'react-paginate';

import DisplayImages from './components/DisplayImages';
import './styles.css';
import Filter from './content/Filter';
import FullImage from './content/FullImage';
import { paginationContainer } from './styles';

const ImageGallery = ({images, showFilter, imagesToDisplay}) => {
	const [fullImage, setFullImage] = useState(null);
	const [itemOffset, setItemOffset] = useState(0);
	const [currentImages, setCurrentImages] = useState([]);
	const [itemsPerPage, setImagePerPage] = useState(imagesToDisplay);
	const [displayedImages, setDisplayedImages] = useState([]);
	const {secondary} = useGetColors();

	const endOffset = itemOffset + itemsPerPage;

	const pageCount = Math.ceil(displayedImages.length / itemsPerPage);

	const handlePageClick = (event) => {
		const newOffset = (event.selected * itemsPerPage) % images.length;
		setItemOffset(newOffset);
	};

	useEffect(() => {
		setCurrentImages(displayedImages.slice(itemOffset, endOffset));
	}, [itemOffset, endOffset, displayedImages]);

	useEffect(() => {
		const width = window.innerWidth;
		const breakpoints = [576, 768, 992, 1200];
		const numberOfImages = [imagesToDisplay / 2, imagesToDisplay / 2, imagesToDisplay, imagesToDisplay];
		for (let n = 0;  breakpoints.length > n; n+=1 ) {
			if ( width < breakpoints[n] ) {
				setImagePerPage(numberOfImages[n]);
				break;
			}
		}
	}, [imagesToDisplay]);

	useEffect(() => {
		if (displayedImages.length === 0) {

			const initialImagesToDisplay = images.sort((a,b) => {
				if (a.date === b.date) {
					// return b.image.name.toLowerCase().localeCompare(a.image.name.toLowerCase()); 
					return b.order - a.order; 
				}
				if (a. date > b.date) {
					return -1;
				}
				if (a. date < b.date) {
					return 1;
				}
				return 0;
			});
			
			
			setDisplayedImages(initialImagesToDisplay.map((image, index) => ({...image, index})));
		}
	 
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		<>
			{showFilter &&
				<Filter
					images={images}
					setImages={setDisplayedImages}
				/>
			}
			<DisplayImages images={currentImages} setShowFullImage={setFullImage} />
			{images.length > itemsPerPage &&
				<div css={paginationContainer}>
					<ReactPaginate
						breakLabel="..."
						nextLabel={
							<IconButton
								text='Next'
								icon={iconContent('right')}
								iconPosition='right'
								isDisabled={false}
								// onClick={() => buttonHandler('left')}
								hoverColor={secondary}
							/>
						}
						onPageChange={handlePageClick}
						pageRangeDisplayed={2}
						pageCount={pageCount}
						previousLabel={
							<IconButton
								text='Previous'
								icon={iconContent('left')}
								iconPosition='left'
								isDisabled={false}
								// onClick={() => buttonHandler('left')}
								hoverColor={secondary}
							/>
						}
						renderOnZeroPageCount={null}
						containerClassName='pagination-container'
						pageLinkClassName='page-link'
						activeLinkClassName='page-link-active'
					
					/>
				</div>
			}
			<FullImage initialIndex={fullImage} setInitialIndex={setFullImage} currentImages={displayedImages} />
		</>
	);
};

ImageGallery.propTypes = {
	images: PropTypes.array,
	showFilter: PropTypes.bool,
	imagesToDisplay: PropTypes.number
};

ImageGallery.defaultProps = {
	images: [],
	showFilter: false,
	imagesToDisplay: 16
};

export default ImageGallery;