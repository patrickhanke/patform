import { getImageUrl } from '@repo/provider';
import './styles.scss';
import { PersonDisplayProps } from './types';

const PersonDisplay = ({person, onlyImage=false}: PersonDisplayProps) => {
	if (!person) {
		return null;
	}
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
				<div className={'display_person_no_image'} data-onlyimage={onlyImage} >
					<div className={'display_person_no_image_placeholder'} />
					<div className='display_person_no_image_character' >
						{person.label.split(' ').map(word => word[0]).join('')}
					</div>

				</div>
			}
			<div className='display_person_label' data-onlyimage={onlyImage}>
				{`${person.label}`}
			</div>
		</div>
	);
};

export default PersonDisplay;