'use client';

import { useContext, useMemo, useState } from 'react';
import {ColumnDef, IconButton, Modal, Page, RenderFilters, Separator, Table, TableColumnCategory, useCreateColumns}  from '@repo/ui';
import useGetImages from './hooks/useGetImages';
import { Filter, Image, ModuleCategory, PageState } from '@repo/types';
import { ImageUploader, useImageDataHandler } from '../ImageUploader';
import { getImageUrl } from '../ImageDisplay';
import deleteImageHandler from '../ImageDisplay/functions/deleteImage';
import deleteModalInitialValues from './constants/deleteModalInitialValues';
import { AppContext, getDateStringsFromIso, useDataHandler } from '@repo/provider';
import EditImage from '../EditImage';

const pageStates: PageState[] = [
    {value: 'all', label: 'Alle'},
    {value: 'active', label: 'Aktiv'},
    {value: 'inactive', label: 'Inaktiv'},
]

const ImagesOverview = () => {
    const {project, currentModule} = useContext(AppContext)
    const {updateData} = useDataHandler();
    const [uploadImages, setUploadImages] = useState(false)
    const [newImages, setNewImages] = useState<string[]>([]);
    const [activeState, setActiveState] = useState(pageStates[0])
    const [filters, setFilters] = useState<Filter[]>([])
    const {images, refetch} = useGetImages({moduleId: currentModule.objectId, filters})
    const {imageUploadHandler} = useImageDataHandler({projectId: project.objectId,afterCancelFunction: refetch, afterSaveFunction: refetch});
    const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues)
    const [editImage, setEditImage] = useState({open: false, image: '', newImage: undefined as unknown as Image | undefined})

    const columns = useCreateColumns<Image>({
        data:[
            {id: 'filePath', type: 'image', label: 'Vorschau'},
            {id: 'name', type: 'edit_string', label: 'Name'},
            {id: 'description', type: 'edit_textfield', label: 'Beschreibung'},
        ],
        fields: currentModule.fields,
        className: 'Image',
        refetch,
        categories: currentModule?.categories
    })


    console.log({images});
    console.log(filters);
    
    
  return (
    <Page 
        title='Bilder'
        pageHeaderButtons={[{text: 'Bilder hochladen', onClick: () => setUploadImages(true)}]}
        emptyContent={true}
        pageStates={pageStates}
        activeState={activeState}
        navOnClick={setActiveState}
    >
        <RenderFilters 
            categories={currentModule.categories} 
            filters={filters} 
            setFilters={setFilters} 
            initialFilters={[]} 
        />
        <Separator size='xs' noLine />
        <Table 
            columns={columns}
            data={images || []}
        />
        <Modal 
            isOpen={uploadImages}
            buttonDisabled={[newImages.length === 0, false]}
            cancelButtonHandler={() => setUploadImages(false)}
            confirmButtonHandler={async () =>{ 
                await imageUploadHandler(newImages)
                setUploadImages(false)
            }}
            header='Upload Images'
        >
            <ImageUploader 
                label='Uploader'  
                path={process.env.BYTESCALE_IMAGE_FOLDER as string} 
                onChange={images => {
                    setNewImages(images as string[])
                }} 
            />
        </Modal>
        <Modal 
            isOpen={deleteModal.isOpen}
            cancelButtonHandler={() => setDeleteModal(deleteModalInitialValues)}
            confirmButtonHandler={() => {
                deleteModal.confirmButtonHandler()
                setDeleteModal(deleteModalInitialValues)
            }}
            header={deleteModal.header}
        >
            <p>Sind sich Sicher, dass sie das Bild löschen möchten?</p>
        </Modal>
        <Modal 
            isOpen={editImage.open}
            cancelButtonHandler={() => setEditImage({open: false, image: '', newImage: undefined})}
            confirmButtonHandler={() => {
                setEditImage({open: false, image: '', newImage: undefined})
                updateData({
                    className: 'Image',
                    objectId: editImage.image,
                    updateObject:  editImage.newImage
                })
            }}
            header='Bild bearbeiten'
        >
            <EditImage 
            image={editImage.image} 
            onChange={image => {
                setEditImage({
                    ...editImage,
                    newImage: image
                })
            }}
            />
        </Modal>
    </Page>
  )
}

export default ImagesOverview