'use client';

import { useMemo } from 'react';
import './styles.scss';
import { usePathname } from 'next/navigation';
import { axiosclient } from '@repo/provider';

const Invite = () => {
	const path = usePathname();	
	console.log(path);

	const project = useMemo(() => {
		let project;
		axiosclient().post('functions/get_project_from_path', {path})
		.then(data => {
			project = data;

		})
		.catch(error => console.error(error.message));
		return project
	}, [])
	console.log(project);

	
	return (
		<>
			<div className={'Invite_left_container'}>
				<div className={'Invite_left_content'}>
					<h1>Patstore Invite</h1>
					<div className={'Invite_divider'} />
					<p>
						Invite Patstore CMS
					</p>
				</div>
				<div className={'Invite_footer'}>
					<p>
						Patstore
					</p>
					<p>
						@ {new Date().getFullYear()}
					</p>
				</div>

			</div>
			<div className={'Invite_right_container'}>
				
				
			</div>
		</>
	);
};

export default Invite;