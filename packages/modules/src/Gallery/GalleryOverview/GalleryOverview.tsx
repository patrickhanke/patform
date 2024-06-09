'use client';

import { useMemo, useState } from 'react';
import {Page, Table}  from '@repo/ui';
import { GalleryOverviewProps } from './types';
import useGetImages from './hooks/useGetImages';
import { PageState } from '@repo/types';

const pageStates: PageState[] = [
    {value: 'all', label: 'Alle'},
    {value: 'active', label: 'Aktiv'},
    {value: 'inactive', label: 'Inaktiv'},
]

const GalleryOverview = ({projectId}: GalleryOverviewProps) => {
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
        pageHeaderButtons={[{text: 'Neues Bild', onClick: () => {}}]}
        hasPageNavigation={true}
        emptyContent={true}
        pageStates={pageStates}
        activeState={activeState}
        navOnClick={setActiveState}
    >
        <h1>Gallerie</h1>
        <Table 
            columns={columns}
            data={[]}
            />
    </Page>
  )
}

export default GalleryOverview