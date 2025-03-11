'use client';

import { FC, useMemo } from 'react';
import './styles.scss';
import { usePathname } from 'next/navigation';
import { axiosclient } from '@repo/provider';
import { PatstoreProject } from '@repo/types';

const Invite = () => {
	const path = usePathname();	
	console.log(path);

	const project: PatstoreProject | undefined = useMemo(() => {
		let project: PatstoreProject | undefined = undefined;
		if (path !== '/login') {
			axiosclient().post('functions/get_project_from_path', {path})
			.then((data) => {
				project = data as unknown as PatstoreProject;
	
			})
			.catch(error => console.error(error.message));
		}
		return project
	}, [])

	console.log({project});
	
	
	return (
		<>
			<div className={'invite_container'}>
				<div >
					<h1>Patstore Invite</h1>
					<p>
						Sie wurden eingeladen, sich bei dem Projekt {project?.name || 'patstore'} anzumelden.
					</p>
				</div>
				<div >
					<p>
						Patstore
					</p>
					<p>
						@ {new Date().getFullYear()}
					</p>
				</div>

			</div>
		</>
	);
};

export default Invite;