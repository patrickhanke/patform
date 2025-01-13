'use client';

import { UserContext, generateColor, useDataHandler } from '@repo/provider';
import { useQuery } from '@apollo/client';
import React, { useContext, useState } from 'react';
import useTableColumns from './hooks/useTableColumns';
import { FIND_ALL_USERS } from '@queries';
import CreateStaffMember from './components/CreateStaffMember';
import { formatISO } from 'date-fns';
import { CreateUser } from '@types';
import { SiteHeader, SlideInRight } from '@repo/ui';
import {Table} from '@repo/ui';

const UserOverview = () => {
	const [isOpen, setIsOpen] = useState(false);
	const {createData, updateData, loading: dataLoading} = useDataHandler();
	const {projectId} = useContext(UserContext);
	
	const {data, refetch}  = useQuery(FIND_ALL_USERS,{
		notifyOnNetworkStatusChange: true
	});
	const columns = useTableColumns({refetch});

	const createWorkerHandler = async (worker: CreateUser, number: number) => {
		await createData({
			className: '_User',
			updateObject: {
				username: worker.email,
				family_name: worker.family_name,
				first_name: worker.first_name,
				role: {__type: 'Pointer', className: '_Role', objectId: worker.role },
				project: {__type: 'Pointer', className: 'Project', objectId: projectId },
				email: worker.email,
				number: number,
				password: worker.password,
				portrait: worker.portrait,
				setttings: {
					start_date: formatISO(new Date()),
					vacation_days: 30,
					color: generateColor()
				}
			},
			afterSaveHandler: async (objectId) => {
				await updateData({
					className: '_Role',
					objectId: worker.role,
					updateObject: {
						users: {__op: 'AddRelation', objects: [{__type: 'Pointer', className: '_User', objectId: objectId}]}
					}
				});	
				refetch();
			}
		});

		setIsOpen(false);
	};

	const siteHeaderButtons = [{
		text: 'Neuen Nutzer anlegen',
		onClick: () => setIsOpen(true),
		is_add_button: true
	}];

	return (
		<>
			<SiteHeader  />
			<div className='site_content'> 
				<div className='content_element no_padding'>
					<Table columns={columns} data={data?.objects?.find_User?.results || []} />
				</div>
			</div>
			<SlideInRight isOpen={isOpen} setIsOpen={setIsOpen} header='Neuen Mitarbeiter anlegen' >
				<CreateStaffMember
					workers={data?.objects?.find_User?.results || []}
					setIsOpen={setIsOpen}
					createWorker={createWorkerHandler}
					loading={dataLoading}
				/>
			</SlideInRight>
		</>
	);
};

export default UserOverview;