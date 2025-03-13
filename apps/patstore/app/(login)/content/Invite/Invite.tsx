'use client';

import { useCallback, useEffect, useState } from 'react';
import './styles.scss';
import { usePathname, useSearchParams } from 'next/navigation';
import { axiosclient } from '@repo/provider';
import { PatstoreProject } from '@repo/types';
import { LoadingIndicator } from '@repo/ui';
import DisplayProject from './components/DisplayProject';
import RegisterForm from './components/RegisterForm';

const Invite = () => {
	const path = usePathname();
	const params = useSearchParams(); 
	const [project, setProject] = useState<PatstoreProject>();
	const [loading, setLoading] = useState(true);

	const getProject = useCallback(() => {
		if (path !== '/login' ) {
			const lastPath = path.substring(path.lastIndexOf('/'));
			console.log(lastPath);
			
			setLoading(true);
			axiosclient().post('functions/get-project-from-path', {path: lastPath})
			.then(response => {
				console.log(response);
				setProject(response.data.result);
				setLoading(false);
			})
			.catch(error =>{ 
				console.error(error.message)
				setLoading(false);
			});
		}
	}, [path])

	useEffect(() => {
		getProject();
	}, [path])

	if (loading) {
		return <LoadingIndicator />
	}
	if (!project) {
		return ( 
			<p className='error'> 
				Dieses Projekt wurde nicht gefunden. 
				Falls es sich um eine gültige Linkeinladung handelt, wenden Sie sich bitte an <a href="mailto:info@patwork.net">info@patwork.net</a>
			</p>
		)
	}

	const email = params.get('email');
	const key = params.get('key');
	console.log(email, key);
	

	return (
		<>
			<div >
				<DisplayProject project={project} />
				<br />
				<p>
					Sie wurden eingeladen, sich bei dem Projekt {project.name || 'patstore'} anzumelden.
				</p>
			</div>
			<div >
				{email && key ?
					<RegisterForm email={email} project={project} invitationKey={key} />
					: 
					<p className='error'> 
						Die Einladung ist ungültig. 
						Falls es sich um eine gültige Linkeinladung handelt, wenden Sie sich bitte an <a href="mailto:info@patwork.net">info@patwork.net</a>.
					</p>
				}
			</div>
		</>
	);
};

export default Invite;