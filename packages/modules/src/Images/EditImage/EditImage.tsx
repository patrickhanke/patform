import { useQuery } from '@apollo/client'
import get_image from './constants/get_image'
import { getImageUrl } from '../ImageDisplay';
import { Loader, Select } from '@repo/ui';
import { useDebounceValue } from 'usehooks-ts';
import { Category, Image } from '@repo/types';
import './styles.scss';
import find_categories from './constants/find_categories';
import { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '@repo/provider';

const EditImage = ({image, onChange}: {image: string, onChange: (I: Image) => void}) => {
    const {currentModule} = useContext(AppContext)
    
    const [imageData, setImageData] = useDebounceValue(undefined as unknown as Image, 500);
    useQuery(get_image, {
        variables: {id: image},
        onCompleted(data) {
            setImageData(data?.objects.getImage || undefined)
        },
    })

    const {data: categoyData} = useQuery(find_categories, {
        variables: {module: currentModule.objectId, type: 'image'}
    })

    const selectOptions = useMemo(() => {
        const categoryOptions = []
        if (categoyData) {
            categoryOptions.push(...categoyData.objects.findCategory.results.map((category: Category) => ({value: category.objectId, label: category.name})))
        }
        return ({categoryOptions})
    }, [categoyData])

    useEffect(() => {
        onChange(imageData)
    }, [imageData])

    console.log(imageData);
    console.log(categoyData);
    return (
        <div className='edit_image_container'>
            <div className='image_preview'>{imageData ? <img width={300} src={getImageUrl({filePath: imageData.filePath, height: 768, width: 1024})} /> : <Loader width='300px' height='200px' />}</div>
            {imageData && typeof imageData === 'object' ? 
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id='name'
                        defaultValue={imageData.name}
                        type="text"
                        onChange={(event) => setImageData({...imageData, name: event.target.value})}
                    />
                </div> : <Loader width='300px' height='40px' /> 
            }
            {imageData ? 
                <div>
                    <label htmlFor="description">Beschreibung</label>
                    <textarea
                        id='description'
                        defaultValue={imageData.description}
                        onChange={(event) => setImageData({...imageData, description: event.target.value})}
                    />
                </div> : <Loader width='300px' height='120px' /> 
            }
            {imageData ? <div>
                <Select
                    label='Tags'
                    options={selectOptions.categoryOptions}
                    isMulti
                    onChange={(value) => setImageData({...imageData, tags: value.map((category: {value: string, label: string}) => category.value)})} 
                />
            </div>: <Loader width='300px' height='40px' /> }
        </div>
    )
}

export default EditImage