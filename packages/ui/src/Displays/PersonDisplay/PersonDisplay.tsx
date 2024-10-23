import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { AppContext, generateGraphQLQuery, getImageUrl } from '@repo/provider';
import './styles.scss';
import { Loader } from '../../Overlays';
import { PersonDisplayProps } from './types';

const PersonDisplay = ({person, onlyImage=false}: PersonDisplayProps) => {
	const {modules} = useContext(AppContext);
	const {data: personData} = useQuery(generateGraphQLQuery({type: 'find', objectName: 'Person', fields: ['objectId', 'label']}), {variables: {params: {module: {_eq:  modules.find(module => module.name === 'Person')?.objectId}}}});

	if (personData) {
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
	}

	if (onlyImage) return <Loader width={'24px'} height={'24px'} />;

	return <Loader width={'120px'} height={'18px'} />;
};

export default PersonDisplay;