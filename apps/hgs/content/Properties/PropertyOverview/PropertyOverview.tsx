'use client';

import { UserContext, useDataHandler } from '@/provider';
import React, { useCallback, useContext } from 'react';
import useTableColumns from './hooks/useTableColumns';
import { dynamicItem } from '@/provider/context/AppContext/types';
import { useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import { FIND_ALL_PROPERTY } from '@/queries';
import CreatePropterty from './components/CreateProperty';
import initialData from './constants/initialData';
import { Property } from '@/types';
import { Loader, SiteHeader, Table } from '@repo/ui';

const PropertyOverview = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const {user, project} = useContext(UserContext);

	const {data, refetch}  = useQuery(FIND_ALL_PROPERTY, {onCompleted(data) {
		const breadcrumbArray: Array<dynamicItem> = [];
		data.objects.findProperty.results.forEach((object: Property) => breadcrumbArray.push({
			value: `/${object.objectId}`,
			label: object.name
		}));
	}});

	const {createData} =  useDataHandler();

	const columns = useTableColumns();

	const createObjectHandler = useCallback(async (data: typeof initialData) => {
		await createData({
			className: 'Property',
			updateObject: {
				name: data.name,
				settings: {'key': false},
				project: {__type: 'Pointer', className: 'Project', objectId: project.objectId},
				created_by: {__type: 'Pointer', className: '_User', objectId: user.objectId}
			},
			afterSaveHandler: () => refetch
		});

		setIsOpen(false);
		refetch();
	}, [user, project]);

	const siteHeaderButtons = [{
		text: 'Neues Objekt erstellen',
		onClick: () => setIsOpen(true),
		is_add_button: true
	}];

	return (
		< >
			<SiteHeader title='Objektübersicht' />
			<SiteHeader isSubHeader siteHeaderButtons={siteHeaderButtons} />
			{/* <List listObject={list} /> */}
			<div className='site_content'> 
				<div className="content_element no_padding">
					<Table columns={columns} data={data?.objects?.findProperty?.results || []} />
				</div>
			</div>
			<CreatePropterty
				objects={data?.objects?.findProperty?.results || []}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				createObject={createObjectHandler}
			/>
		</>
	);
};

export default PropertyOverview;