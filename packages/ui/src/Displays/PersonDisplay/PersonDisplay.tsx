import { getImageUrl } from '@repo/provider';
import './styles.scss';
import { Loader } from '../../Overlays';
import { PersonDisplayProps } from './types';

const PersonDisplay = ({person, onlyImage=false}: PersonDisplayProps) => {

	// const worker  = workerData.objects.get_User;
	return (
		<div className={'display_person_container'} data-onlyimage={onlyImage} >
			{person.portrait ? 
				<div className={'display_person_image_container'}  data-onlyimage={onlyImage} >
					<img
						src={getImageUrl({filePath: person.portrait, width: 60, height: 60})}
						alt={`${person.label}`}
						width={onlyImage ? '24px' : '18px'}
						height={onlyImage ? '24px' : '18px'}
					/>
				</div>
				:
				<div className={'display_person_no_image'} data-onlyimage={onlyImage}>
					<div className={'display_person_no_image_background'} />
					<div className={'display_person_no_image_character'} >{`${person.label}`}</div>
				</div>
			}
		</div>
	);


	return <Loader width={'120px'} height={'18px'} />;
};

export default PersonDisplay;