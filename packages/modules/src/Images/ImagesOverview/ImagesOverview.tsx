'use client';

import { useContext, useMemo, useState } from 'react';
import {ColumnDef, IconButton, Modal, Page, RenderFilters, Table, TableColumnCategory}  from '@repo/ui';
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
    const [uploadImages, setUploadImages] = useState(false)
    const [newImages, setNewImages] = useState<string[]>([]);
    const [activeState, setActiveState] = useState(pageStates[0])
    const [filters, setFilters] = useState<Filter[]>([])
    const {images, refetch} = useGetImages({moduleId: currentModule.objectId, filters})
    const {imageUploadHandler} = useImageDataHandler({projectId: project.objectId,afterCancelFunction: refetch, afterSaveFunction: refetch});
    const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues)
    const {deleteData} = useDataHandler();
    const [editImage, setEditImage] = useState({open: false, image: '', newImage: undefined as unknown as Image | undefined})

    const columns = useMemo(() => {
        const columnArray:ColumnDef<Image>[] = [
		{
			accessorFn: row => <img src={getImageUrl({filePath: row.filePath})} />,
			header: () => <span>Vorschau</span>,
			id: 'preview',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorKey: 'createdAt',
			header: () => <span>Erstellt</span>,
			id: 'erstellt',
            cell: info => getDateStringsFromIso(info.getValue() as string).datumUhrzeit,
			footer: info => info.column.id
		},
		{
            accessorKey: 'name',
			header: () => <span>Name</span>,
			id: 'name',
            cell: info => info.getValue(),
			footer: info => info.column.id
		},
		// {
        //     accessorFn: row => <a href={getImageUrl({filePath: row.filePath})} target='__blank' >{getImageUrl({filePath: row.filePath})} </a> ,
		// 	header: () => <span>Url</span>,
		// 	id: 'filePath',
		// 	cell: info => info.getValue(),
		// 	footer: info => info.column.id
		// },
		
	] 
    currentModule.categories.forEach((category: ModuleCategory) => {
        columnArray.push({
            accessorFn: row => <TableColumnCategory category={category} categories={row.categories} className='Image' objectId={row.objectId}  />,
            header: () => <span>{category.label}</span>,
            id: category.id,
            cell: info => info.getValue(),
            footer: info => info.column.id
        })
    })

    columnArray.push({
        accessorFn: row => 
            <div className='button_container'>
                <IconButton
                    icon='edit'
                    onClick={() => setEditImage({open: true, image: row.objectId, newImage: undefined})}
                />
                <IconButton
                    icon='download'
                    isBlank
                    isLink
                    link ={'row.file.url'}
                />
                <IconButton
                    icon='delete'
                    onClick={() => setDeleteModal({
                        images: [row.filePath],
                        isOpen: true,
                        confirmButtonHandler: async () => {
                            await deleteImageHandler({
                                accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
                                apiKey: process.env.BYTESCALE_SECRET_KEY as string,
                                filePath: row.filePath
                            });
                            await deleteData({
                                className: 'Image',
                                objectId: row.objectId,
                            })
                            refetch();
                            setDeleteModal({...deleteModal, isOpen: false})
                        },
                        header: 'Bilder löschen'
                    })}
                />
            </div>,
        header: () => <span>Bearbeiten</span>,
        id: 'edit',
        cell: info => info.getValue(),
        footer: info => info.column.id
    })

    return columnArray;
} , [currentModule]);


    console.log(editImage);
    console.log(filters);
    
    
  return (
    <Page 
        title='Bilder'
        pageHeaderButtons={[{text: 'Bilder hochladen', onClick: () => setUploadImages(true)}]}
        pageHeaderContent={
            <RenderFilters 
                categories={currentModule.categories} 
                filters={filters} 
                setFilters={setFilters} 
                initialFilters={[]} 
            />
        }
        emptyContent={true}
        pageStates={pageStates}
        activeState={activeState}
        navOnClick={setActiveState}
    >
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
            }}
            header='Bild bearbeiten'
        >
            <EditImage 
            projectId={project.objectId} 
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