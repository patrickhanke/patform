'use client';

import { useMemo, useState } from 'react';
import {Modal, Page, Table}  from '@repo/ui';
import { ImagesOverviewProps } from './types';
import useGetImages from './hooks/useGetImages';
import { PageState } from '@repo/types';
import { UploadDropzone } from '@bytescale/upload-widget-react';
import { ImageUploader } from '../ImageUploader';


const pageStates: PageState[] = [
    {value: 'all', label: 'Alle'},
    {value: 'active', label: 'Aktiv'},
    {value: 'inactive', label: 'Inaktiv'},
]

const ImagesOverview = ({projectId}: ImagesOverviewProps) => {
    const [uploadImages, setUploadImages] = useState(false)
    const [activeState, setActiveState] = useState(pageStates[0])
    const [filters, setFilters] = useState([])
    const {images} = useGetImages({projectId, filters})
    const columns = useMemo(() => [
        {}
    ],[])

    console.log(images);

  return (
    <Page 
        title='Bilder'
        pageHeaderContent={<p>Text</p>}
        pageHeaderButtons={[{text: 'Bilder hochladen', onClick: () => setUploadImages(true)}]}
        hasPageNavigation={true}
        emptyContent={true}
        pageStates={pageStates}
        activeState={activeState}
        navOnClick={setActiveState}
    >
        <h1>Gallerie</h1>
        <Table 
            columns={images}
            data={[]}
            />
            <Modal 
                isOpen={uploadImages}
                cancelButtonHandler={() => setUploadImages(false)}
                confirmButtonHandler={() => setUploadImages(false)}
                header='Upload Images'

            >
                <ImageUploader filename='123' />
            </Modal>
    </Page>
  )
}

export default ImagesOverview